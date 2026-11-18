//! Token-based formatter for Monkey C and Jungle source.
//!
//! Behaviour mirrors `packages/extensions/vscode/src/format-monkeyc.ts`:
//! conservative, line-preserving, brace-aware indentation, `} else {` merging,
//! and blank-line collapsing. It operates on the token stream rather than raw
//! text, so strings and comments are handled structurally.

use monkey_syntax::{Token, TokenKind, is_control_keyword, lex};

/// Formatting options.
#[derive(Clone, Debug)]
pub struct FormatOptions {
    /// Indent unit: `Some(n)` spaces, or `None` for tabs.
    pub indent_width: Option<usize>,
    /// Line ending sequence.
    pub line_ending: LineEnding,
}

/// Line ending style.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LineEnding {
    Lf,
    Crlf,
}

impl Default for FormatOptions {
    fn default() -> Self {
        Self {
            indent_width: Some(2),
            line_ending: LineEnding::Lf,
        }
    }
}

/// Format Monkey C source text.
pub fn format_monkeyc(src: &str, options: &FormatOptions) -> String {
    let tokens = lex(src);
    let nl = match options.line_ending {
        LineEnding::Lf => "\n",
        LineEnding::Crlf => "\r\n",
    };
    let indent_unit = match options.indent_width {
        Some(n) => " ".repeat(n),
        None => "\t".to_string(),
    };

    let mut out = String::with_capacity(src.len() + src.len() / 8);
    let mut indent = 0usize;
    let mut line_has_code = false;
    let mut force_newline = false;
    let mut case_colon_pending = false;
    let mut paren_depth = 0i64;
    let mut prev: Option<&Token> = None;

    let is_close_merge = |t: &Token| {
        t.kind == TokenKind::Keyword && matches!(t.text.as_str(), "else" | "catch" | "finally")
    };

    for t in tokens.iter().filter(|t| t.kind != TokenKind::Eof) {
        // Dedent before emitting `}` and `case`/`default` labels.
        if t.text == "}" && t.kind == TokenKind::Punct {
            indent = indent.saturating_sub(1);
        }
        if t.kind == TokenKind::Keyword && (t.text == "case" || t.text == "default") {
            indent = indent.saturating_sub(1);
            case_colon_pending = true;
        }

        let merge_with_prev = prev.is_some_and(|p| p.text == "}" && is_close_merge(t));

        let structural_newline = match prev {
            Some(p) if p.text == "{" => true,
            Some(_) if t.text == "}" && line_has_code => true,
            _ => false,
        };

        let need_newline =
            !merge_with_prev && (force_newline || t.newlines_before > 0 || structural_newline);

        if need_newline {
            if !out.is_empty() {
                out.push('\n');
                if t.newlines_before >= 2 {
                    out.push('\n');
                }
            }
            for _ in 0..indent {
                out.push_str(&indent_unit);
            }
            line_has_code = false;
            force_newline = false;
        }

        let emit_space = !need_newline
            && line_has_code
            && prev.is_some_and(|p| needs_space(p, t, t.space_before));

        if emit_space {
            out.push(' ');
        }

        match t.kind {
            TokenKind::LineComment => {
                let body = t.text.trim_start_matches('/').trim_start();
                out.push_str("// ");
                out.push_str(body.trim_end());
                force_newline = true;
            }
            TokenKind::BlockComment => {
                if t.text.contains('\n') {
                    let mut first = true;
                    for part in t.text.split('\n') {
                        if !first {
                            out.push('\n');
                            for _ in 0..indent {
                                out.push_str(&indent_unit);
                            }
                        }
                        first = false;
                        out.push_str(part.trim_end());
                    }
                    force_newline = true;
                } else {
                    out.push_str(&t.text);
                }
            }
            _ => out.push_str(&t.text),
        }
        line_has_code = true;

        // Post-emit bookkeeping.
        if t.text == "{" {
            indent += 1;
        }
        if t.text == ":" && t.kind == TokenKind::Punct && case_colon_pending && paren_depth == 0 {
            indent += 1;
            case_colon_pending = false;
        }
        match t.text.as_str() {
            "(" | "[" => paren_depth += 1,
            ")" | "]" => paren_depth -= 1,
            _ => {}
        }
        prev = Some(t);
    }

    // Normalise line endings and trim trailing blank space.
    let mut result = out.replace('\n', nl);
    while result.ends_with(nl) {
        result.truncate(result.len() - nl.len());
    }
    // Collapse runs of blank lines at EOF already handled; ensure exactly one EOL.
    result.push_str(nl);
    result
}

/// Whether a space should be emitted between `prev` and `cur` when they stay
/// on the same line. `input_space` is whether the source had whitespace there.
fn needs_space(prev: &Token, cur: &Token, input_space: bool) -> bool {
    let p = prev.text.as_str();
    let c = cur.text.as_str();

    // Never a space before these.
    if matches!(c, "," | ";" | ")" | "]" | "." | ":") {
        return false;
    }
    // Never a space after opening delimiters or member access.
    if matches!(p, "(" | "[" | ".") {
        return false;
    }
    // Colon: preserve whatever the source had (annotations `(:foo)`).
    if p == ":" {
        return input_space;
    }
    // Control keywords keep a space before their condition: `if (`.
    if c == "(" {
        if prev.kind == TokenKind::Keyword && is_control_keyword(p) {
            return true;
        }
        if matches!(
            prev.kind,
            TokenKind::Ident
                | TokenKind::Keyword
                | TokenKind::Number
                | TokenKind::Str
                | TokenKind::CharLit
        ) {
            return false;
        }
        return input_space;
    }
    // Space before an opening brace.
    if c == "{" {
        return true;
    }
    // After `}`: merge keywords handled earlier; `;`/`,`/`)` hug the brace.
    if p == "}" {
        return match c {
            "else" | "catch" | "finally" => true,
            ";" | "," | ")" | "]" => false,
            _ => input_space,
        };
    }
    // Force a space after `,` and `;` (like the JS formatter's insertion).
    if p == "," || p == ";" {
        return !matches!(c, ")" | "]" | "}" | "," | ";");
    }
    // Member/index access hugs: `foo [0]` keeps source spacing via default.
    input_space
}

/// Format Jungle (`*.jungle`) source: `key = value` lines, comments preserved.
pub fn format_jungle(src: &str, options: &FormatOptions) -> String {
    let nl = match options.line_ending {
        LineEnding::Lf => "\n",
        LineEnding::Crlf => "\r\n",
    };
    let mut out: Vec<String> = Vec::new();
    let mut pending_blank = false;

    for raw in src.replace("\r\n", "\n").replace('\r', "\n").split('\n') {
        let trimmed = raw.trim();
        if trimmed.is_empty() {
            pending_blank = !out.is_empty();
            continue;
        }
        if pending_blank {
            out.push(String::new());
            pending_blank = false;
        }
        if trimmed.starts_with('#') {
            out.push(trimmed.to_string());
            continue;
        }
        match trimmed.find('=') {
            Some(eq) => {
                let key = trimmed[..eq].trim();
                let value = trimmed[eq + 1..].trim();
                out.push(format!("{} = {}", key, value));
            }
            None => out.push(trimmed.split_whitespace().collect::<Vec<_>>().join(" ")),
        }
    }
    while out.last().is_some_and(|l| l.is_empty()) {
        out.pop();
    }
    let mut result = out.join(nl);
    result.push_str(nl);
    result
}

/// Pick the formatter for a file based on its extension.
pub fn format_source(src: &str, path: &str, options: &FormatOptions) -> String {
    if path.ends_with(".jungle") {
        format_jungle(src, options)
    } else {
        format_monkeyc(src, options)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn formats_basic_function() {
        let src = "class Foo {\nfunction bar() as Void {\nvar  x   =   1;\n}\n}\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert_eq!(
            out,
            "class Foo {\n  function bar() as Void {\n    var x = 1;\n  }\n}\n"
        );
    }

    #[test]
    fn merges_else_after_brace() {
        let src = "if (x) {\n  a();\n}\nelse {\n  b();\n}\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert!(out.contains("} else {"), "got:\n{}", out);
    }

    #[test]
    fn control_keywords_get_space() {
        let src = "if(x){y();}\nwhile(z){w();}\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert!(out.contains("if (x) {"));
        assert!(out.contains("while (z) {"));
    }

    #[test]
    fn function_calls_hug_paren() {
        let src = "var x = foo ( 1 ,2 );\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert!(out.contains("foo(1, 2)"), "got: {}", out);
    }

    #[test]
    fn keeps_trailing_comments() {
        let src = "var x = 1; // set x\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert!(out.contains("var x = 1; // set x"), "got: {}", out);
    }

    #[test]
    fn collapses_blank_lines() {
        let src = "var a = 1;\n\n\n\nvar b = 2;\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert_eq!(out.matches("\n\n").count(), 1, "got: {:?}", out);
    }

    #[test]
    fn is_idempotent() {
        let src = "class A extends B {\n  function f(x as Lang.Number) as Lang.Number {\n    if (x > 0) { return x; } else { return -x; }\n  }\n}\n";
        let once = format_monkeyc(src, &FormatOptions::default());
        let twice = format_monkeyc(&once, &FormatOptions::default());
        assert_eq!(once, twice);
    }

    #[test]
    fn formats_jungle() {
        let src = "project.manifest=manifest.xml\n\n# comment\nfoo=  bar  \n";
        let out = format_jungle(src, &FormatOptions::default());
        assert_eq!(
            out,
            "project.manifest = manifest.xml\n\n# comment\nfoo = bar\n"
        );
    }

    #[test]
    fn case_labels_indent() {
        let src = "switch (x) {\ncase 1:\n  a();\n  break;\ndefault:\n  b();\n}\n";
        let out = format_monkeyc(src, &FormatOptions::default());
        assert!(out.contains("case 1:"), "got:\n{}", out);
        assert!(out.contains("  a();"), "got:\n{}", out);
        assert!(out.contains("default:"), "got:\n{}", out);
    }
}

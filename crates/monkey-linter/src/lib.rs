//! Lint diagnostics for Monkey C source.

use monkey_syntax::{Token, TokenKind, lex};

/// Severity of a diagnostic.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Severity {
    Warning,
    Error,
}

/// A single lint finding.
#[derive(Clone, Debug)]
pub struct Diagnostic {
    /// Stable rule identifier, e.g. `no-trailing-whitespace`.
    pub rule: &'static str,
    pub severity: Severity,
    pub message: String,
    /// 1-based line.
    pub line: usize,
    /// 1-based column.
    pub column: usize,
}

impl Diagnostic {
    fn new(
        rule: &'static str,
        severity: Severity,
        message: impl Into<String>,
        line: usize,
        column: usize,
    ) -> Self {
        Self {
            rule,
            severity,
            message: message.into(),
            line,
            column,
        }
    }
}

/// Run all lint rules over Monkey C source. `path` is used for context only.
pub fn lint_monkeyc(src: &str, _path: &str) -> Vec<Diagnostic> {
    let mut diags = Vec::new();
    lint_text(src, &mut diags);
    lint_request_update(src, &mut diags);
    diags
}

/// Text-level rules that also apply to Jungle files.
pub fn lint_text(src: &str, diags: &mut Vec<Diagnostic>) {
    let mut blank_run = 0usize;
    let lines: Vec<&str> = src.split('\n').collect();
    for (idx, line) in lines.iter().enumerate() {
        let line_no = idx + 1;
        let trimmed_end = line.trim_end_matches([' ', '\t', '\r']);
        if trimmed_end.len() != line.len() {
            diags.push(Diagnostic::new(
                "no-trailing-whitespace",
                Severity::Warning,
                "trailing whitespace",
                line_no,
                trimmed_end.len() + 1,
            ));
        }
        if line.trim().is_empty() {
            blank_run += 1;
            if blank_run > 1 {
                diags.push(Diagnostic::new(
                    "no-multiple-empty-lines",
                    Severity::Warning,
                    "multiple consecutive blank lines",
                    line_no,
                    1,
                ));
            }
        } else {
            blank_run = 0;
        }
        if line.starts_with('\t') {
            diags.push(Diagnostic::new(
                "use-space-indent",
                Severity::Warning,
                "tab indentation; use spaces",
                line_no,
                1,
            ));
        }
    }
    if !src.is_empty() && !src.ends_with('\n') {
        diags.push(Diagnostic::new(
            "eof-newline",
            Severity::Warning,
            "file does not end with a newline",
            lines.len(),
            lines.last().map_or(1, |l| l.len() + 1),
        ));
    }
}

/// Flag `WatchUi.requestUpdate()` calls inside `onUpdate` — they create a
/// continuous redraw loop and drain the battery. Updates belong in `onShow`.
fn lint_request_update(src: &str, diags: &mut Vec<Diagnostic>) {
    let tokens: Vec<Token> = lex(src)
        .into_iter()
        .filter(|t| t.kind != TokenKind::Eof)
        .collect();

    // One entry per open brace: the name of the function that brace belongs
    // to (inherited from the enclosing function for non-function blocks).
    let mut pending_fn: Option<String> = None;
    let mut fn_stack: Vec<Option<String>> = Vec::new();

    // Single pass with index so `function <name>` can be paired.
    let mut i = 0usize;
    while i < tokens.len() {
        let t = &tokens[i];
        if t.text == "function" && t.kind == TokenKind::Keyword {
            if let Some(name) = tokens.get(i + 1).filter(|n| n.kind == TokenKind::Ident) {
                pending_fn = Some(name.text.clone());
            }
        } else if t.text == "{" {
            let inherited = fn_stack.iter().rev().flatten().next().cloned();
            fn_stack.push(pending_fn.take().or(inherited));
        } else if t.text == "}" {
            fn_stack.pop();
        } else if t.text == "requestUpdate" && t.kind == TokenKind::Ident {
            let enclosing = fn_stack.iter().rev().flatten().next().map(String::as_str);
            if enclosing == Some("onUpdate") {
                diags.push(Diagnostic::new(
                    "no-request-update-in-onupdate",
                    Severity::Error,
                    "WatchUi.requestUpdate() inside onUpdate causes a redraw loop; request updates in onShow instead",
                    t.line(src),
                    t.column(src),
                ));
            }
        }
        i += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn flags_trailing_whitespace() {
        let d = lint_monkeyc("var x = 1;   \nvar y = 2;\n", "t.mc");
        assert!(d.iter().any(|x| x.rule == "no-trailing-whitespace"));
    }

    #[test]
    fn flags_missing_eof_newline() {
        let d = lint_monkeyc("var x = 1;", "t.mc");
        assert!(d.iter().any(|x| x.rule == "eof-newline"));
    }

    #[test]
    fn flags_request_update_in_onupdate() {
        let src = "class V extends WatchUi.WatchFace {\n  function onUpdate(dc as Dc) as Void {\n    WatchUi.requestUpdate();\n  }\n  function onShow() as Void {\n    WatchUi.requestUpdate(WatchUi.UPDATE_EVERY_MINUTE);\n  }\n}\n";
        let d = lint_monkeyc(src, "t.mc");
        let hits: Vec<_> = d
            .iter()
            .filter(|x| x.rule == "no-request-update-in-onupdate")
            .collect();
        assert_eq!(
            hits.len(),
            1,
            "diags: {:?}",
            d.iter().map(|x| &x.rule).collect::<Vec<_>>()
        );
        assert_eq!(hits[0].line, 3);
    }

    #[test]
    fn clean_file_has_no_diags() {
        let src = "class Foo {\n  function bar() as Void {\n    var x = 1;\n  }\n}\n";
        assert!(lint_monkeyc(src, "t.mc").is_empty());
    }
}

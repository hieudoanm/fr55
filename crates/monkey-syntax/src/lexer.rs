//! Hand-written lexer for Monkey C.
//!
//! The lexer is intentionally permissive: it never fails, it produces the
//! best-effort token stream even for malformed input so that formatting and
//! linting tools can still operate on broken files.

use crate::token::{CONTROL_KEYWORDS, KEYWORDS, Token, TokenKind};

const PUNCT: &[char] = &[
    '(', ')', '{', '}', '[', ']', '<', '>', ',', ';', '.', ':', '+', '-', '*', '/', '%', '=', '!',
    '&', '|', '^', '~', '?', '@',
];

/// Multi-character operators, longest first.
const MULTI_PUNCT: &[&str] = &[
    ">>>", "==", "!=", "<=", ">=", "&&", "||", "++", "--", "+=", "-=", "*=", "/=", "%=", "<<",
    ">>", "=>",
];

/// Lex `src` into a token stream ending with an `Eof` token.
pub fn lex(src: &str) -> Vec<Token> {
    let b = src.as_bytes();
    let len = b.len();
    let mut tokens = Vec::new();
    let mut i = 0usize;
    let mut newlines = 0usize;
    let mut space = false;

    while i < len {
        let c = b[i] as char;
        match c {
            ' ' | '\t' | '\r' => {
                space = true;
                i += 1;
            }
            '\n' => {
                newlines += 1;
                space = false;
                i += 1;
            }
            '/' if i + 1 < len && b[i + 1] == b'/' => {
                let start = i;
                while i < len && b[i] != b'\n' {
                    i += 1;
                }
                push(
                    &mut tokens,
                    src,
                    start,
                    i,
                    TokenKind::LineComment,
                    newlines,
                    space,
                );
                newlines = 0;
                space = false;
            }
            '/' if i + 1 < len && b[i + 1] == b'*' => {
                let start = i;
                i += 2;
                while i + 1 < len && !(b[i] == b'*' && b[i + 1] == b'/') {
                    i += 1;
                }
                i = (i + 2).min(len);
                push(
                    &mut tokens,
                    src,
                    start,
                    i,
                    TokenKind::BlockComment,
                    newlines,
                    space,
                );
                newlines = 0;
                space = false;
            }
            '"' | '\'' => {
                let quote = c;
                let start = i;
                i += 1;
                while i < len {
                    if b[i] == b'\\' {
                        i = (i + 2).min(len);
                        continue;
                    }
                    if b[i] as char == quote {
                        i += 1;
                        break;
                    }
                    i += 1;
                }
                let kind = if quote == '"' {
                    TokenKind::Str
                } else {
                    TokenKind::CharLit
                };
                push(&mut tokens, src, start, i, kind, newlines, space);
                newlines = 0;
                space = false;
            }
            '0'..='9' => {
                let start = i;
                if c == '0' && i + 1 < len && (b[i + 1] == b'x' || b[i + 1] == b'X') {
                    i += 2;
                    while i < len && (b[i] as char).is_ascii_hexdigit() {
                        i += 1;
                    }
                } else {
                    while i < len && (b[i] as char).is_ascii_digit() {
                        i += 1;
                    }
                    if i < len && b[i] == b'.' && i + 1 < len && (b[i + 1] as char).is_ascii_digit()
                    {
                        i += 1;
                        while i < len && (b[i] as char).is_ascii_digit() {
                            i += 1;
                        }
                    }
                    if i < len && (b[i] == b'e' || b[i] == b'E') {
                        let mut j = i + 1;
                        if j < len && (b[j] == b'+' || b[j] == b'-') {
                            j += 1;
                        }
                        if j < len && (b[j] as char).is_ascii_digit() {
                            i = j;
                            while i < len && (b[i] as char).is_ascii_digit() {
                                i += 1;
                            }
                        }
                    }
                }
                push(
                    &mut tokens,
                    src,
                    start,
                    i,
                    TokenKind::Number,
                    newlines,
                    space,
                );
                newlines = 0;
                space = false;
            }
            '.' if i + 1 < len && (b[i + 1] as char).is_ascii_digit() => {
                let start = i;
                i += 1;
                while i < len && (b[i] as char).is_ascii_digit() {
                    i += 1;
                }
                push(
                    &mut tokens,
                    src,
                    start,
                    i,
                    TokenKind::Number,
                    newlines,
                    space,
                );
                newlines = 0;
                space = false;
            }
            'a'..='z' | 'A'..='Z' | '_' => {
                let start = i;
                while i < len {
                    let ch = b[i] as char;
                    if ch.is_ascii_alphanumeric() || ch == '_' {
                        i += 1;
                    } else {
                        break;
                    }
                }
                let text = &src[start..i];
                let kind = if KEYWORDS.contains(&text) {
                    TokenKind::Keyword
                } else {
                    TokenKind::Ident
                };
                push(&mut tokens, src, start, i, kind, newlines, space);
                newlines = 0;
                space = false;
            }
            _ if PUNCT.contains(&c) => {
                let start = i;
                let rest = &src[i..];
                let mut matched = None;
                for op in MULTI_PUNCT {
                    if rest.starts_with(op) {
                        matched = Some(op.len());
                        break;
                    }
                }
                i += matched.unwrap_or(1);
                push(
                    &mut tokens,
                    src,
                    start,
                    i,
                    TokenKind::Punct,
                    newlines,
                    space,
                );
                newlines = 0;
                space = false;
            }
            _ => {
                // Unknown byte (e.g. non-ASCII): skip it but keep trivia counts sane.
                i += 1;
            }
        }
    }

    tokens.push(Token {
        kind: TokenKind::Eof,
        text: String::new(),
        start: len,
        end: len,
        newlines_before: newlines,
        space_before: space,
    });
    tokens
}

fn push(
    tokens: &mut Vec<Token>,
    src: &str,
    start: usize,
    end: usize,
    kind: TokenKind,
    newlines: usize,
    space: bool,
) {
    tokens.push(Token {
        kind,
        text: src[start..end].to_string(),
        start,
        end,
        newlines_before: newlines,
        space_before: space,
    });
}

/// Whether `text` is a keyword that introduces a parenthesised condition.
pub fn is_control_keyword(text: &str) -> bool {
    CONTROL_KEYWORDS.contains(&text)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::token::TokenKind;

    fn kinds(src: &str) -> Vec<TokenKind> {
        lex(src).iter().map(|t| t.kind).collect()
    }

    #[test]
    fn lexes_basic_code() {
        let toks = lex("class Foo {\n  function bar() as Void {\n    var x = 1;\n  }\n}\n");
        assert_eq!(toks[0].kind, TokenKind::Keyword);
        assert_eq!(toks[0].text, "class");
        assert_eq!(toks[1].text, "Foo");
        assert_eq!(toks.last().unwrap().kind, TokenKind::Eof);
    }

    #[test]
    fn tracks_newlines_and_space() {
        let toks = lex("var a=1;\n\nvar b = 2;");
        let semi = toks.iter().find(|t| t.text == ";").unwrap();
        let vars: Vec<_> = toks.iter().filter(|t| t.text == "var").collect();
        let b = toks.iter().find(|t| t.text == "b").unwrap();
        assert!(!semi.space_before);
        assert_eq!(vars[1].newlines_before, 2);
        assert!(!vars[1].space_before);
        assert!(b.space_before);
        let two = toks.iter().find(|t| t.text == "2").unwrap();
        assert!(two.space_before);
    }

    #[test]
    fn lexes_comments_and_strings() {
        let kinds = kinds("// hi\nvar s = \"a\\\"b\"; /* x\ny */ var c = 'a';");
        assert!(kinds.contains(&TokenKind::LineComment));
        assert!(kinds.contains(&TokenKind::BlockComment));
        assert!(kinds.contains(&TokenKind::Str));
        assert!(kinds.contains(&TokenKind::CharLit));
    }

    #[test]
    fn lexes_numbers_and_operators() {
        let toks = lex("var x = 0x1F + 60.0 * 2e3 >= 4;");
        let texts: Vec<&str> = toks.iter().map(|t| t.text.as_str()).collect();
        assert!(texts.contains(&"0x1F"));
        assert!(texts.contains(&"60.0"));
        assert!(texts.contains(&"2e3"));
        assert!(texts.contains(&">="));
    }
}

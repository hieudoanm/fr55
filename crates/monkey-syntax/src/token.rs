//! Token model for Monkey C source files.

/// The kind of a lexical token.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TokenKind {
    /// Identifier or keyword-like name (`foo`, `HandsView`).
    Ident,
    /// Reserved keyword (`function`, `class`, `var`, ...).
    Keyword,
    /// Integer, float, or hex literal.
    Number,
    /// Double-quoted string literal.
    Str,
    /// Single-quoted character literal.
    CharLit,
    /// `// ...` comment (text excludes the newline).
    LineComment,
    /// `/* ... */` comment (text includes the delimiters and any newlines).
    BlockComment,
    /// Single or multi-character punctuation/operator.
    Punct,
    /// End of file marker.
    Eof,
}

/// A lexical token with its raw text and position.
#[derive(Clone, Debug)]
pub struct Token {
    pub kind: TokenKind,
    /// Raw source text of the token.
    pub text: String,
    /// Byte offset of the first character.
    pub start: usize,
    /// Byte offset one past the last character.
    pub end: usize,
    /// Number of `\n` characters in the whitespace before this token.
    pub newlines_before: usize,
    /// Whether horizontal whitespace (` ` or `\t`) precedes this token on the
    /// same line. Always false when `newlines_before > 0`.
    pub space_before: bool,
}

impl Token {
    /// 1-based line number of the token start.
    pub fn line(&self, src: &str) -> usize {
        src[..self.start].bytes().filter(|&b| b == b'\n').count() + 1
    }

    /// 1-based column of the token start.
    pub fn column(&self, src: &str) -> usize {
        let line_start = src[..self.start].rfind('\n').map_or(0, |i| i + 1);
        self.start - line_start + 1
    }
}

/// Monkey C reserved words.
pub const KEYWORDS: &[&str] = &[
    "as",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "do",
    "else",
    "enum",
    "extends",
    "false",
    "final",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "private",
    "protected",
    "public",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "var",
    "void",
    "while",
];

/// Keywords that are always followed by a parenthesised condition.
pub const CONTROL_KEYWORDS: &[&str] = &["if", "for", "while", "switch", "catch"];

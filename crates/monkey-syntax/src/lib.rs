//! Lexer and token model for Monkey C.

mod lexer;
mod token;

pub use lexer::{is_control_keyword, lex};
pub use token::{CONTROL_KEYWORDS, KEYWORDS, Token, TokenKind};

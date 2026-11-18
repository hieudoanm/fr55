# monkey-syntax

Lexer and token model for the Monkey C language (Garmin Connect IQ).

Zero dependencies. The lexer is permissive — it never fails and produces a
best-effort token stream even for malformed input so downstream tools
(formatter, linter) can still operate on broken files.

## Tokens

`lex(src) -> Vec<Token>` returns every token followed by an `Eof` marker.
Each `Token` carries:

- `kind` — `Ident`, `Keyword`, `Number`, `Str`, `CharLit`, `LineComment`,
  `BlockComment`, `Punct`, `Eof`
- `text` — the raw source slice
- `start` / `end` — byte offsets
- `newlines_before` — count of `\n` in the whitespace before the token
- `space_before` — whether horizontal whitespace precedes it on the same line

`KEYWORDS`, `CONTROL_KEYWORDS`, and `is_control_keyword()` are exported for
consumers that need keyword-aware decisions (e.g. `if (` spacing).

## Usage

```rust
use monkey_syntax::lex;

for token in lex("var x = 1;\n") {
    println!("{:?} {:?}", token.kind, token.text);
}
```

## Tests

```bash
cargo test -p monkey-syntax
```

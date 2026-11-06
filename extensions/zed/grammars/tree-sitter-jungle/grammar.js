/**
 * Tree-sitter grammar for Connect IQ Jungle (`monkey.jungle`) files.
 *
 * Jungle is a small key/value configuration format used by the Garmin Connect IQ
 * toolchain. This grammar intentionally covers only the surface a text editor
 * needs: `#` comments, dotted keys, `key = value` assignments, `$(...)` lookups,
 * and `;`/`:` path separators.
 */
module.exports = grammar({
  name: 'jungle',

  extras: () => [/[ \t]/],

  rules: {
    document: ($) =>
      seq(
        repeat(choice($._newline, $.comment, seq($.pair, $._newline))),
        optional($.pair),
      ),

    _newline: () => /\r?\n/,

    comment: () => token(seq('#', /[^\r\n]*/)),

    pair: ($) => seq(field('key', $.key), '=', field('value', optional($.value))),

    key: ($) => seq($.key_segment, repeat(seq('.', $.key_segment))),

    key_segment: () => /[A-Za-z0-9_-]+/,

    value: ($) => repeat1(choice($.lookup, $.path_separator, $.value_text)),

    lookup: ($) => seq('$(', field('name', $.lookup_name), ')'),

    lookup_name: () => /[A-Za-z0-9_.-]+/,

    path_separator: () => token(/[;:]/),

    value_text: () => token(/[^$;:\s\r\n][^$;:\r\n]*/),
  },
});

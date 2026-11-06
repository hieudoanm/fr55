(comment) @comment

(pair key: (key (key_segment) @property))
(pair key: (key "." @punctuation.delimiter))

"=" @operator

(lookup "$(" @punctuation.special)
(lookup (lookup_name) @variable.special)
(lookup ")" @punctuation.special)

(path_separator) @punctuation.delimiter

(value_text) @string

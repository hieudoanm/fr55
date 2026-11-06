.PHONY: test format-test grammar-test install

test: format-test grammar-test

format-test:
	node --test formatter/

grammar-test:
	cd grammars/tree-sitter-jungle && npx --yes tree-sitter-cli@0.25.3 test

install:
	./scripts/install.sh

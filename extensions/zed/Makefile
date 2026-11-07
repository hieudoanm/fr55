.PHONY: test format-test grammar-test install

test: format-test grammar-test

format-test:
	node --test formatter/

grammar-test:
	cd grammars/tree-sitter-jungle && npx --yes tree-sitter-cli@0.27.1 test

install:
	./scripts/install.sh

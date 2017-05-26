# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

lib/writer.js: src/writer.js src/parser.js
	@echo "Compiling $< to $@ and creating a source map at $@.map"
	@npm run --silent browserify -- --entry $< --debug | npm run --silent exorcist -- $@.map > $@ --base lib

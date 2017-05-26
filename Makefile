#https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

lib/writer.js: src/parser.js src/writer.js
	npm run browserify -- --entry $< --outfile $@

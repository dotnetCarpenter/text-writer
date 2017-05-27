# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

OUT_DIR = dist

$(OUT_DIR)/writer.min.js: $(OUT_DIR)/writer.js
	@echo "Compressing $< to $@ and creating a source map at $@.map"
	@npm run --silent uglifyjs -- --mangle --compress --source-map content=$<.map,url=$(notdir $@.map) --output $@ -- $<

$(OUT_DIR)/writer.js: src/writer.js src/parser.js src/util.js | $(OUT_DIR)
	@echo "Creating bundle $< to $@ and creating a source map at $@.map"
	@npm run --silent browserify -- --debug --entry $< | \
	npm run --silent exorcist -- $@.map > $@ --base $(OUT_DIR)

$(OUT_DIR):
	@mkdir -v $@

JS=dist/flashfp3-6.0.js
JS_MIN=dist/flashfp3-6.0.min.js


# http://flowplayer.org/license
concat:
	# flashfp3.js
	@ cat src/javascript/PropertyBinder.js src/javascript/Fp3EngineUtils.js src/javascript/Fp3EngineEvents.js src/javascript/Fp3Engine.js src/javascript/flashfp3.js > $(JS)

min: concat
	# flashfp3.min.js
	@ uglifyjs $(JS)  --mangle -c > $(JS_MIN)
	@ cp $(JS_MIN) test/javascript/

js: min


.PHONY: min

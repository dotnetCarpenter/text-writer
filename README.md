text-writer - **alpha**
===========

[![Build Status](https://travis-ci.org/dotnetCarpenter/text-writer.svg?branch=master)](https://travis-ci.org/dotnetCarpenter/text-writer)


## distribution ##

`dist/`:

- `writer.js`
- `writer.js.map`
- `writer.min.js`
- `writer.min.js.map`


## dev commands ##

- `make` or `npm run build` - build dist/ files from source files
- `npm run dev` - run `make` every 2 seconds

The main difference between `make` or `npm run build` is that the latter will
always create a build, while `make` will only create a build if any of the
source files has changed. `make` requires both *nodejs* and *make* to be
installed, while `npm run build` only requires *nodejs*. `npm run dev` require
*make* and *watch* to be installed.

## dev tools ##

- list TODOs - `./TODO`

## dev dependencies ##

- browserify - modules
- exorcist - external source map
- uglify-es - minifier

'use strict'

module.exports = {
  map
}

function map(f, iterable) {
  return Array.prototype.map.call(iterable, x => f(x))
}

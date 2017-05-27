(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

/* TESTS */

// TODO: create function that get the selected element + its childNodes
let tokens1 = document.getElementById("test1").childNodes
let tree1 = parser( tokens1 )

// let tokens2 = document.getElementById("test2").childNodes
// let tree2 = parser( tokens2 )

// let tokens3 = document.getElementById("test3").childNodes
// let tree3 = parser( tokens3 )

console.log(JSON.stringify(tree1))
console.log(JSON.stringify(tree1, function(key, value) {
  return value
}))
// console.log(JSON.stringify(tree2))
// console.log(JSON.stringify(tree3))




module.exports = exports = parser

/**
 * Parses tokens into a graph with "writable" objects
 * @param {Node[]|NodeList|Iterable<Node>} tokens
 * @return {Writer}
 */
function parser(tokens) {
  return writer( map(textFactory, tokens)
    .reduce(treeBuilder, []) )
}

function writer(writables) {
  let current = last(writables)
  return {
    get textLength() { // Maybe you could just call textContent.length on the root node you pass to the parser
      return map(x => x.textLength, writables)
        .reduce((a,b) => a + b)
    },
    remove(n) {
      if(!current) return
      if(current.textLength === 0) {
        current = current.previousSibling
        this.remove(n)
        return
      }

      current.textContent = current.textContent.slice(0, -n)
    }
  }
}

function map(f, iterable) {
  return Array.prototype.map.call(iterable, x => f(x))
}

/**
 * Creates "writable" text objects
 * @param {Node} node
 * @return {Object}
 */
function textFactory(node) {
  return {
    // node,
    nodeName: node.nodeName,
    nodeType: node.nodeType,
    childNodes: node.childNodes,
    get textContent() {
      return node.textContent
    },
    set textContent(value) {
      node.textContent = value
    },
    get textLength() {
      return node.textContent.length
    },
    // nextSibling: null,
    previousSibling: null,
    // writeText,
    // removeText,
  }
}

function treeBuilder(tree, text) {
  switch(text.nodeType) {
    case Node.ELEMENT_NODE:
      tree.push(text)
      if(text.childNodes.length)
        text.childNodes = map(textFactory, text.childNodes)
                            .reduce(treeBuilder, [])
      break
    case Node.TEXT_NODE: // TODO: don't ignore empty nodes anyway, they're important for <pre> etc. and I can simplify or remove treeBuilder
      text.textContent.trim() === '' || tree.push(text)
      break
  }
  text.previousSibling = tree[tree.length - 2]
  return tree
}

function last(indexed) {
  return indexed[indexed.length - 1]
}

},{}],2:[function(require,module,exports){
'use strict'

const parser = require('./parser')

let entry = document.querySelector('.entry')

document.addEventListener("click", bind(writeStatus, entry, 'Document is clicked'), false);
//setTimeout(bind(writeStatus, entry, 'Hello World'), 1000)
setTimeout(bind(eraseText, entry.querySelector('.entry__status'), 60), 500)

function bind(f, /*args*/) {
  var args = [].slice.call(arguments)
  return f.bind.apply(f, args)
}

function writeStatus(entry, msg) {
  let entryStatus = entry.querySelectorAll(".entry__status")
  entryStatus.forEach(function(status) {
    eraseText(status, 40, function(){
      status.classList.add('entry__status_active')
      writeText(status, msg, 60)
    })
  })
}

function eraseText(el, speed, cb) {
  let text = parser(el.childNodes)
  // let textLength = text.textLength
  let n = el.textContent.length
  let timer = setInterval(() => {
    text.remove(1)
    //el.textContent = el.textContent.slice(0, -1)
    n--
    if(n === 0) {
      clearInterval(timer)
      // el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
}

function writeText(el, string, speed, cb) {
  let chars = [].slice.call(string)
  let n = 0, max = chars.length
  let timer = setInterval(() => {
    el.textContent += chars[n]
    n++
    if(n === max) {
      clearInterval(timer)
      el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
}

},{"./parser":1}]},{},[2])
//# sourceMappingURL=writer.js.map

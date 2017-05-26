(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.parser = parser

// TODO: create function that get the selected element + its childNodes
let tokens1 = document.getElementById("test1").childNodes
let tree1 = parser( tokens1 )

let tokens2 = document.getElementById("test2").childNodes
let tree2 = parser( tokens2 )

let tokens3 = document.getElementById("test3").childNodes
let tree3 = parser( tokens3 )

console.log(JSON.stringify(tree1, function(key, value) {
  return value
}))
console.log(JSON.stringify(tree2))
console.log(JSON.stringify(tree3))


/**
 * Parses tokens into a graph with "writable" objects
 * @param {Array|NodeList|Iterable} tokens
 * @return {Object[]}
 */
function parser(tokens) {
  return map(textFactory, tokens)
    .reduce(treeBuilder, [])
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
    textContent: node.textContent.trim(),
    childNodes: node.childNodes,
    // nextSibling: null,
    // previousSibling: null,
    writeText,
    removeText,
  }
}

function writeText() {}
function removeText() {}

function treeBuilder(tree, text) {
  switch(text.nodeType) {
    case Node.ELEMENT_NODE:
      tree.push(text)
      // text.previousSibling = last(tree)
      if(text.childNodes.length)
        text.childNodes = map(textFactory, text.childNodes)
                            .reduce(treeBuilder, [])
      break
    case Node.TEXT_NODE: // TODO: don't ignore empty nodes anyway, they're important for <pre> etc. and I can simplify or remove treeBuilder
      // text.textContent.trim() === '' || tree.push(text)
      break
  }
  return tree
}

function last(indexed) {
  return indexed[indexed.length - 1]
}

},{}]},{},[1]);

'use strict'

const map = require('./util').map

/* TESTS */

// TODO: create function that get the selected element + its childNodes
let tokens1 = document.getElementById("test1").childNodes
let tree1 = parser( tokens1 )

// let tokens2 = document.getElementById("test2").childNodes
// let tree2 = parser( tokens2 )

// let tokens3 = document.getElementById("test3").childNodes
// let tree3 = parser( tokens3 )

console.log(JSON.stringify(tree1))
// console.log(JSON.stringify(tree2))
// console.log(JSON.stringify(tree3))




module.exports = exports = parser

/**
 * Parses tokens into a graph with "writable" objects
 * @param {Node[]|NodeList|Iterable<Node>} tokens
 * @return {Writer}
 */
function parser(tokens) {
  return map(textFactory, tokens)
    .reduce(treeBuilder, [])
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
    previousSibling: null
    // writeText,
    // removeText,
  }
}

function treeBuilder(tree, text) {
  switch(text.nodeType) {
    case Node.ELEMENT_NODE:
      tree.push(text)
      if(text.childNodes.length)
        text.childNodes = parser(text.childNodes)
      break
    case Node.TEXT_NODE:
      text.textContent.trim() === '' || tree.push(text)
      break
  }
  text.previousSibling = tree[tree.length - 2]
  return tree
}

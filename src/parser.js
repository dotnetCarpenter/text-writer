'use strict'

const map = require('./util').map

// export
parser.serialize = serialize
module.exports = exports = parser

function serialize(tokens) {
  return JSON.stringify(tokens, replacer)
}

function replacer(key, value) {
  let blacklist = ['nextSibling', 'previousSibling']
  return blacklist.indexOf(key) === -1 ? value : undefined
}

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
    previousSibling: undefined,
    nextSibling: undefined
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
  if(text.previousSibling) text.previousSibling.nextSibling = text

  return tree
}

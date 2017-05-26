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
    innerHTML: node.innerHTML,
    outerHTML: node.outerHTML,
    innerText: node.innerText,
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

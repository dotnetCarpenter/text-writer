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

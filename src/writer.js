'use strict'

const parser = require('./parser')
const map = require('./util').map

main()

function main() {
  // TODO: create function that get the selected element + its childNodes
  let entry = document.querySelector('#test3')
  document.addEventListener("click", bind(writeStatus, entry, '<strong>This</strong> is freaking <i>AWESOME!</i>'), false)

  function bind(f /*,args*/) {
    let args = [].slice.call(arguments)
    return f.bind.apply(f, args)
  }

  function writeStatus(entry, msg) {
    let entryStatus = [].slice.call(entry.children)
    entryStatus.forEach(function(status) {
      eraseText(status, 40, function() {
        writeText(status, msg, 60)
      })
    })
  }
}

function eraseText(el, speed, cb) {
  let text = writer( parser(el.childNodes) )
  // let textLength = text.textLength
  let n = el.textContent.length
  let timer = setInterval(() => {
    text.erase(1)
    //el.textContent = el.textContent.slice(0, -1)
    n--
    if(n === 0) {
      clearInterval(timer)
      // el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
}

function writeText(el, html, speed, cb) {
  let clone = el.cloneNode(false)
  clone.innerHTML = html
  let text = writer( parser(clone.childNodes) )
  let n = 0, max = clone.textContent.length // text.textLength
  let timer = setInterval(() => {
    text.add(el, 1)
    n++
    if(n === max) {
      clearInterval(timer)
      // el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
}

function writer(writables) {
  let eraseCurrent = last(writables)
  let writeCurrent = first(writables)
  let cursor = 0//, end = writables.textLength
  let placeholder
  return {
    get textLength() { // TODO: Maybe you could just call textContent.length on the root node you pass to the parser
      return map(x => x.textLength, writables)
        .reduce((a,b) => a + b)
    },
    add(el, n) {
      if(!placeholder) placeholder = el
      if(writeCurrent.textLength === cursor) {
        writeCurrent = writeCurrent.nextSibling

        if(writeCurrent.textLength === 0) {
          this.add(el, n) // skip element
          return
        } else if(writeCurrent.nodeType === Node.ELEMENT_NODE) {
          placeholder = document.createElement(writeCurrent.nodeName)
        } else if(writeCurrent.nodeType === Node.TEXT_NODE) {
          placeholder = document.createTextNode('')
        }

        el.appendChild(placeholder)
        cursor = 0
      }

      placeholder.textContent += writeCurrent.textContent[cursor]
      cursor += n
    },
    erase(n) {
      if(!eraseCurrent) return
      if(eraseCurrent.textLength === 0) {
        eraseCurrent = eraseCurrent.previousSibling
        this.erase(n) // skip element
        return
      }

      eraseCurrent.textContent = eraseCurrent.textContent.slice(0, -n)
    }
  }
}

function last(indexed) {
  return indexed[indexed.length - 1]
}

function first(indexed) {
  return indexed[0]
}



/* TESTS */
// let tokens1 = document.getElementById("test1").childNodes
// let tree1 = parser( tokens1 )

// let tokens2 = document.getElementById("test2").childNodes
// let tree2 = parser( tokens2 )

// let tokens3 = document.getElementById("test3").childNodes
// let tree3 = parser( tokens3 )

// let json1 = parser.serialize(tree1)
// let json2 = parser.serialize(tree2)
// let json3 = parser.serialize(tree3)
// console.log(json1)
// console.log(json2)
// console.log(json3)
//
// let entry = document.querySelector('.entry')
// document.addEventListener("click", bind(writeStatus, entry, 'Document <i>is</i> clicked'), false)
// setTimeout(bind(eraseText, entry.querySelector('.entry__status'), 60), 500)
// setTimeout(bind(writeStatus, entry, 'Hello <span>World</span>'), 1000)

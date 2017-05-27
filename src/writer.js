'use strict'

const parser = require('./parser')
const map = require('./util').map

main()

function main() {
  // TODO: create function that get the selected element + its childNodes
  let entry = document.querySelector('.entry')

  document.addEventListener("click", bind(writeStatus, entry, 'Document is clicked'), false)
  setTimeout(bind(writeStatus, entry, 'Hello <span>World</span>'), 1000)
  // setTimeout(bind(eraseText, entry.querySelector('.entry__status'), 60), 500)

  function bind(f /*,args*/) {
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
}

function eraseText(el, speed, cb) {
  let text = writer( parser(el.childNodes) )
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
  let current = 0//, end = writables.textLength
  let placeholder
  return {
    get textLength() { // Maybe you could just call textContent.length on the root node you pass to the parser
      return map(x => x.textLength, writables)
        .reduce((a,b) => a + b)
    },
    add(el, n) {
      if(!placeholder) placeholder = el
      if(writeCurrent.textLength === current) {
        writeCurrent = writeCurrent.nextSibling

        placeholder = document.createElement(writeCurrent.nodeName)
        el.appendChild(placeholder)

        current = 0
      }

      placeholder.textContent += writeCurrent.textContent[current]
      current += n
    },
    remove(n) {
      if(!eraseCurrent) return
      if(eraseCurrent.textLength === 0) {
        eraseCurrent = eraseCurrent.previousSibling
        this.remove(n)
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

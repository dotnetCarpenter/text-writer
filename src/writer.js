'use strict'

const parser = require('./parser')
const map = require('./util').map

main()

function main() {
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
  el = el.cloneNode(false)
  el.innerHTML = html
  let text = writer( parser(el.childNodes) )
  let n = 0, max = el.textContent.length // text.textLength
  let timer = setInterval(() => {
    el.textContent += text[n]
    n++
    if(n === max) {
      clearInterval(timer)
      el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
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

function last(indexed) {
  return indexed[indexed.length - 1]
}

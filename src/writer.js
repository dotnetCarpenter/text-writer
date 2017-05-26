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
  let n = el.textContent.length
  let text = parser(el.childNodes)
  let timer = setInterval(() => {
    el.textContent = el.textContent.slice(0, -1)
    n--
    if(n === 0) {
      clearInterval(timer)
      el.dataset.writing = 0
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

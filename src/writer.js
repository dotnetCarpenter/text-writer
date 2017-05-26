'use strict'

let parser = require('./parser')

document.addEventListener("click", bind(writeStatus, 'Document is clicked'), false);
writeStatus('Hello World')

function bind(f, /*args*/) {
  var args = [].slice.call(arguments)
  return f.bind.apply(f, args)
}

function writeStatus(msg) {
  var entries = document.querySelectorAll(".entry")

  entries.forEach(function(entry) {
    var entryStatus = entry.querySelectorAll(".entry__status")
    entryStatus.forEach(function(status) {
      removeString(status, 40, function(){
        status.classList.add('entry__status_active')
        addString(status, msg, 60)
      })
    })
  })
}

function addString(el, string, speed, cb) {
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

function removeString(el, speed, cb) {
  let n = el.textContent.length
  var timer = setInterval(() => {
    el.textContent = el.textContent.slice(0, -1)
    n--
    if(n === 0) {
      clearInterval(timer)
      el.dataset.writing = 0
      cb && cb()
    }
  }, speed)
}

'use strict'

import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import parser from '../src/parser'

function getHtml(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) reject(err)
      resolve( new JSDOM(data) )
    })
  })
}

getHtml(path.join(__dirname, '/fixture/flat.html'))
  .then(html => {
    console.log(html.window.document)
    console.log(html.window.document.querySelector('#test1').childNodes)
  },
  error => {
    console.error(error)
  })

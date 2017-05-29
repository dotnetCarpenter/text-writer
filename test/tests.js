'use strict'

import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import test from 'ava'

import parser from '../src/parser'

function getHtml(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) reject(err)
      resolve( new JSDOM(data) )
    })
  })
}

test('parser can parse flat html', async t => {
  const dom = await getHtml(path.join(__dirname, 'fixture/flat.html'))
  const tokens = dom.window.document.querySelector('#test1').childNodes
  let actual = parser( tokens )
  let expected
  console.log(actual)
});


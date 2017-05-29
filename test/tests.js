'use strict'

import { JSDOM } from 'jsdom'
import fs from 'fs'
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
  let actual = parser( getHtml('fixture/flat.html').childNodes )
  let expected
  console.log(actual)
});

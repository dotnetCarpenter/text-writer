'use strict'

import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import test from 'ava'

import parser from '../src/parser'

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) reject(err)
      resolve( data )
    })
  })
}
async function getHtml(path) {
  return new JSDOM( await readFile(path) )
}

test('parser can parse flat html', async t => {
  const dom = await getHtml(path.join(__dirname, 'fixture/flat.html'))
  const tokens = dom.window.document.querySelector('#test1').childNodes
  let actual = parser( tokens )[0]

  // let expected = {"nodeName":"H1","nodeType":1,"childNodes":[{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":"test AF","textLength":7},{"nodeName":"BR","nodeType":1,"childNodes":{},"textContent":"","textLength":0},{"nodeName":"PRE","nodeType":1,"childNodes":[{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":" s  i  m  p  l  e","textLength":17}],"textContent":" s  i  m  p  l  e","textLength":17},{"nodeName":"BR","nodeType":1,"childNodes":{},"textContent":"","textLength":0},{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":"parser","textLength":6}],"textContent":"test AF s  i  m  p  l  eparser","textLength":30}
  // console.log(actual)

  t.is(actual.nodeName,        'H1', 'nodeName must be H1')
  t.is(actual.nodeType,           1, 'nodeType must be 1')
  t.is(actual.nextSibling,     null, 'nextSibling must be null')
  t.is(actual.previousSibling, null, 'previousSibling must be null')
});

test('and can serialize the flat html', async t => {
  const dom = await getHtml(path.join(__dirname, 'fixture/flat.html'))
  const tokens = dom.window.document.querySelector('#test1').childNodes
  let parsed = parser( tokens )[0]
  let expected = await readFile(path.join(__dirname, 'fixture/tree1.json'))
  let actual = parsed.serialize()
  t.deepEqual(actual, expected)

})


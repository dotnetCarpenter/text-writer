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
  let actual = parser( tokens )[0]

  // let expected = {"nodeName":"H1","nodeType":1,"childNodes":[{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":"test AF","textLength":7},{"nodeName":"BR","nodeType":1,"childNodes":{},"textContent":"","textLength":0},{"nodeName":"PRE","nodeType":1,"childNodes":[{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":" s  i  m  p  l  e","textLength":17}],"textContent":" s  i  m  p  l  e","textLength":17},{"nodeName":"BR","nodeType":1,"childNodes":{},"textContent":"","textLength":0},{"nodeName":"#text","nodeType":3,"childNodes":{},"textContent":"parser","textLength":6}],"textContent":"test AF s  i  m  p  l  eparser","textLength":30}
  // console.log(actual)

  t.is(actual.nodeName,             'H1', 'nodeName must be H1');
  t.is(actual.nodeType,                1, 'nodeType must be 1');
  t.is(actual.previousSibling, undefined, 'previousSibling must be undefined');
  t.is(actual.nextSibling,     undefined, 'nextSibling must be undefined');
});


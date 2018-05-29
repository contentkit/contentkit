#!/usr/bin/env node

const execa = require('execa')
const Bundler = require('parcel-bundler')
const path = require('path')
const fs = require('fs')
const file = path.join(__dirname, '../lib/index.html')

const options = {
  outDir: './dist',
  outFile: 'index.html',
  publicUrl: '/',
  watch: false,
  minify: true,
  target: 'browser',
  https: true,
  logLevel: 3,
  sourceMaps: true,
  detailedReport: true
}

const sw = `
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js')

if (workbox) {
  console.log('Yay! Workbox is loaded 🎉')
  workbox.routing.registerRoute(
    /.*\.css/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'css-cache',
    })
  )
  
  workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    workbox.strategies.cacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
  )
} else {
  console.log('Boo! Workbox did not load 😬')
}`

async function start () {
  await execa('babel', ['src', '-d', 'lib', '--copy-files'])
  const bundler = new Bundler(file, options)
  await bundler.bundle()
  fs.writeFileSync(path.join(__dirname, '../dist/service-worker.js'), sw)
}

start()

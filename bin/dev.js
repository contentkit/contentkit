#!/usr/bin/env node

const execa = require('execa')

execa('babel', ['src', '-d', 'lib', '--copy-files']).then(() => {
  execa('babel', ['src', '-d', 'lib', '--copy-files', '--watch'])
  let parcel = execa('parcel', ['lib/index.html'])
  console.log('...')
  parcel.stdout.pipe(process.stdout)
  parcel.stderr.pipe(process.stdout)

  parcel.catch(err => {
    throw err
  })
})

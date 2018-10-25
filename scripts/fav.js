const favicons = require('favicons')
const path = require('path')
const fs = require('fs')

favicons(
  path.join(__dirname, 'contentkit-favicon.png'),
  {
    appName: 'ContentKit',
    path: __dirname,
    icons: {
      favicons: true
    },
    logging: true
  },
  (err, response) => {
    if (err) console.log(err)
    response.images.map(image => {
      fs.writeFile(path.join(__dirname, 'icons', image.name), image.contents, () => {})
    })
  }
)

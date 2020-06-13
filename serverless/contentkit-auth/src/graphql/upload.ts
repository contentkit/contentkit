
import * as AWS from 'aws-sdk'
import aws4 from 'aws4'
import * as path from 'path'
import * as querystring from 'querystring'
import mime from 'mime-types'

const { AWS_BUCKET, AWS_REGION } = process.env

const s3 = new AWS.S3({
  region: AWS_REGION
})

const parseXAmzDate = (string) => {
  const date = [
    string.slice(0, 4),
    string.slice(4, 6),
    string.slice(6, 8)
  ].join('-')
  const time = [
    string.slice(8, 11),
    string.slice(11, 13),
    string.slice(13, 16)
  ].join(':')
  return (Date.parse(`${date}${time}`) / 1000)
}

const isExpired = (url) => {
  let parsed = querystring.parse(url)
  let expires : number = Number(parsed['X-Amz-Expires'])
  let date : number = parseXAmzDate(parsed['X-Amz-Date'])
  return (expires + date) > (Date.now() / 1000)
}

const assetMiddleware = (upload) => {
  const basename = path.basename(upload.key, path.extname(upload.key))
  const thumbnail = sign({ key: `${upload.id}/thumbnail.jpg` })
  const file = sign({ key: `${upload.id}/${basename}.pdf` })
  return {
    ...upload,
    file,
    thumbnail
  }
}

function sign ({ key }) {
  const type = encodeURIComponent(mime.lookup(key))
  const host = 's3.amazonaws.com'
  const signed = aws4.sign({
    host: host,
    path: `/${AWS_BUCKET}/${key}?response-content-type=${type}&X-Amz-Expires=3600`,
    service: 's3',
    region: AWS_REGION,
    signQuery: true
  })
  return `https://${host}${signed.path}`
}

function createTagSet (data) {
  const tags = Object.keys(data).map(key =>
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  ).join('')
  return `<Tagging><TagSet>${tags}</TagSet></Tagging>`
}

export function createPresignedPost (parent, { userId, key }, ctx) {
  const tagging = createTagSet({ sub: userId })

  return new Promise((resolve, reject) => {
    s3.createPresignedPost({
      Bucket: AWS_BUCKET,
      Fields: {
        tagging: tagging,
        key: key
      }
    }, (err, data) => {
      console.log(data)
      if (err) reject(err)
      resolve(data)
    })
  })
}

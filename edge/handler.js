exports.rewrite = (event, context, callback) => {
  const request = event.Records[0].cf.request

  if (/^(?!\/api|\/static).*\/(?!\.)\w*$/m.test(request.uri)) {
    request.uri = request.uri.replace(/(\/.*\/)/g, '/')
  }
  callback(null, request)
}

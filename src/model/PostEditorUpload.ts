
type PostEditorUploadOptions = {
  prefix: string
}

class PostEditorUpload {
  file: File
  prefix: string
  constructor (file: File, { prefix }: PostEditorUploadOptions) {
    this.file = file
    this.prefix = prefix
  }

  getFileName () {
    return this.file.name.replace(/[^A-Za-z-_.0-9]/g, '')
  }

  getKey () {
    return `static/${this.prefix}/${this.getFileName()}`
  }

  upload (payload: { fields: any, url: string }) {
    const formData = new window.FormData()
    for (const field in payload.fields) {
      formData.append(field, payload.fields[field])
    }
    formData.append('file', this.file, this.getFileName())
  
    return fetch(payload.url, {
      method: 'POST',
      body: formData
    })
  }

}

export default PostEditorUpload

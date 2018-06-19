class LocalStorage {
  get (key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  set (key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value))
  }

  push (key, value) {
    let data = this.get(key) || []
    data.push(value)
    this.set(key, data)
  }
}

export default LocalStorage

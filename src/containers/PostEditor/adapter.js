import memoize from 'lodash.memoize'
import LocalStorage from './LocalStorage'
import { toKey } from './util'

const getVersions = memoize((cacheKey, id) => {
  const key = toKey(id, 'versions')
  const versions = new LocalStorage().get(key)
  return versions
})

class Adapter {
  constructor({ getProps }) {
    this.getProps = getProps
    this.cacheKey = 1
  }
  getVersions: () => {
    const { post: { Post: { document } } } = this.getProps()
    return getVersions(this.cacheKey, document.id)
  },
  restore: (diffKey) => {
    const { post: { Post: { document } } } = this.getProps()
    return restoreContentState(document, diffKey)
  }
}


export default Adapter
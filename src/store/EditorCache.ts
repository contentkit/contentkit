

import { expand, compress } from 'draft-js-compact'

import { ContentBlock, EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import invariant from 'fbjs/lib/invariant'
import { OrderedMap } from 'immutable'

class EditorCache {
  id: string
  previousBlockMap: OrderedMap<string, ContentBlock>
  constructor({ id }) {
    this.id = id
  }

  static create (id: string) {
    return new EditorCache({ id })
  }

  getSerializedState () {
    return window.localStorage.getItem(`editor.${this.id}.state`)
  }

  getRawState () {
    const serializedState = this.getSerializedState()

    if (serializedState) {
      try {
        return JSON.parse(serializedState)
      } catch (err) {
        console.error(err)
      }
    }
  
    return null
  }

  getHash () {
    return window.localStorage.getItem(`editor.${this.id}.hash`)
  }

  setState (state) {
    window.localStorage.setItem(`editor.${this.id}.state`, state)
  }

  setHash (hash) {
    window.localStorage.setItem(`editor.${this.id}.hash`, hash)
  }

  convertToRaw (editorState) {
    return compress(convertToRaw(editorState.getCurrentContent()))
  }

  getEditorState (): null | EditorState {
    const rawState = this.getRawState()

    if (rawState) {
      return EditorState.createWithContent(convertFromRaw(expand(rawState)))
    }

    return null
  }

  static async hash (str) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
    return Array.prototype.map.call(new Uint8Array(buffer), x => (('00' + x.toString(16)).slice(-2))).join('')
  }

  serialize (editorState) {
    try {
      return JSON.stringify(this.convertToRaw(editorState))
    } catch (err) {
      console.log(err)
    }
  }

  async save (editorState) {
    const blockMap = editorState.getCurrentContent().getBlockMap()
    if (blockMap === this.previousBlockMap) {
      console.warn('Redundant save to local storage')
      return
    }

    this.previousBlockMap = blockMap

    invariant(this.id, 'No current postId')

    let serializedState = this.serialize(editorState)
    const hash = await EditorCache.hash(serializedState)

    if (this.getHash() === hash) {
      console.warn('Redundant save to local storage')
      return
    }

    this.setState(serializedState)
    this.setHash(hash)
  }

  clear () {
    window.localStorage.removeItem(`editor.${this.id}.state`)
    window.localStorage.removeItem(`editor.${this.id}.hash`)
  }
}

export default EditorCache

import { EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import { convertToHTML } from '@contentkit/convert'
import { expand, compress } from 'draft-js-compact'
import { Block } from '@contentkit/util'
import transform from '@contentkit/util/lib/utils/transform'
import invariant from 'fbjs/lib/invariant'
import { debounce } from 'lodash'
import { encode } from 'base64-unicode'

export const convertFromEditorStateToRaw = (editorState: EditorState) => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

export const convertFromRawToEditorState = (raw: any): EditorState => {
  return EditorState.createWithContent(
    convertFromRaw(expand(raw))
  )
}

export const expandCompressedRawContentBlocks = (editorState: EditorState, compressedRaw: any): EditorState => {
  const raw = expand(compressedRaw)
  const blocks = raw.blocks.reduce((a, block) => {
    if (block.type !== Block.CODE) {
      a.push(block)
      return a
    }

    const codeBlocks = block.text.split(/\r?\n/g)
      .map(text => {
        return {
          ...block,
          text: text,
          key: genKey()
        }
      })
    a = a.concat(codeBlocks)
    return a
  }, [])

  return EditorState.createWithContent(convertFromRaw({
    ...raw,
    blocks
  }))
}


export async function sha256(str: string) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
  return Array.prototype.map.call(new Uint8Array(buffer), x => (('00' + x.toString(16)).slice(-2))).join('')
}

export const getCacheKey = (postId: string, suffix: string = 'state') => `editor.${postId}.${suffix}`


export const debouncedSaveEditorStateToLocalStorage = debounce(
  async (
    editorState: EditorState,
    postId: string,
    callback: () => void
  ) => {
  invariant(postId, 'No current postId')
  const prevHash = window.localStorage.getItem(getCacheKey(postId, 'hash'))

  let serializedState
  try {
    const rawEditorState = convertFromEditorStateToRaw(editorState)
    serializedState = JSON.stringify(rawEditorState)
  } catch (err) {
    console.log(err)
    return
  }

  const nextHash = await sha256(serializedState)

  if (prevHash === nextHash) {
    console.warn('Redundant save to local storage')
    return
  }

  try {
    window.localStorage.setItem(getCacheKey(postId, 'hash'), nextHash)
    window.localStorage.setItem(getCacheKey(postId, 'state'), serializedState)
  } catch (err) {
    console.error(err)
    return
  }

  callback()
}, 1000)
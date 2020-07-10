import React from 'react'
import { Button } from '@material-ui/core'
import { useDebounce } from 'react-use'
import { useSnackbar } from 'notistack'
import { expand } from 'draft-js-compact'
import { DeleteForever } from '@material-ui/icons'
import EditorCache from '../store/EditorCache'
import {
  expandCompressedRawContentBlocks
} from '../store/utils'

function useLocalStorage ({ postId, editorState, onDiscard, onChange, raw }) {
  const { enqueueSnackbar } = useSnackbar()
  const rawEditorStateRef = React.useRef(null)

  const openSnackbar = () => {
    enqueueSnackbar('Loading unsaved changes backed up in your browser.', {
      variant: 'info',
      action: key => (
        <Button
          variant='text'
          startIcon={<DeleteForever />}
          onClick={onDiscard(key, rawEditorStateRef)}
          // className={classes.button}
        >
          Discard Changes
        </Button>
      )
    })
  })

  const [isReady, cancel] = useDebounce(() => {
    EditorCache.create(postId).save(editorState)
  }, 6000, [postId, editorState])

  const ready = isReady()
  React.useEffect(() => {
    if (ready) {
      enqueueSnackbar('Saved locally', {
        variant: 'success',
        autoHideDuration: 1000,
        persist: false,
        preventDuplicate: true
      })
    }
  }, [ready])

  React.useEffect(() => {
    if (!raw) {
      return
    }
    if (rawEditorStateRef.current) {
      return
    }
    let rawEditorState = expand(raw)
    const editorCache = new EditorCache({ id: postId })
    EditorCache.hash(JSON.stringify(rawEditorState)).then(hash => {
      rawEditorStateRef.current = rawEditorState
    
      const localRawEditorState = EditorCache.create(postId).getRawState()
      if (localRawEditorState && hash !== editorCache.getHash()) {
        rawEditorState = localRawEditorState
        openSnackbar()
      }

      onChange(expandCompressedRawContentBlocks(editorState, rawEditorState))
    })
  }, [raw])

  return [isReady, cancel]
}

export default useLocalStorage

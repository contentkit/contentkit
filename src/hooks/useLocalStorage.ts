import React from 'react'
import { useDebounce } from 'react-use'
import { useSnackbar } from 'notistack'
import EditorCache from '../store/EditorCache'

function useLocalStorage (postId, editorState) {
  const { enqueueSnackbar } = useSnackbar()
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

  return [isReady, cancel]
}

export default useLocalStorage

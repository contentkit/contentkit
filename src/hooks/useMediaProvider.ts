import React from 'react'
import { useApolloClient } from '@apollo/client'
import { MediaProvider } from '@contentkit/components'
import { AWS_BUCKET_URL } from '../lib/config'

function useMediaProvider () {
  const mediaProvider : React.RefObject<MediaProvider> = React.useRef(null)
  const client = useApolloClient()
  const config = {
    baseUrl: `${AWS_BUCKET_URL}/`
  }

  if (!mediaProvider.current) {
    // @ts-ignore
    mediaProvider.current = new MediaProvider(config, client)
  }

  return mediaProvider.current
}

export default useMediaProvider

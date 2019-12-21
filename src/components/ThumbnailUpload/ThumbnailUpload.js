import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { IconButton } from '@material-ui/core'

const DeleteIcon = props => (
  <svg
    width='22'
    height='22'
    aria-hidden='true'
    focusable='false'
    data-prefix='fal'
    data-icon='trash'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 448 512'
  >
    <path fill='currentColor' d='M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z'></path>
  </svg>
)

const useDropzoneStyles = makeStyles(theme => ({
  dropzone: {
    backgroundColor: '#fafafa',
    border: '1px dashed #ddd',
    width: 100,
    height: 100,
    zIndex: 9999,
    padding: 10,
    boxSizing: 'border-box',
  },
  input: {
    display: 'none'
  },
  drag: {
    borderColor: '#ccc',
    background: '#dbdbdb',
    backgroundImage: 'linear-gradient(-45deg, #d2d2d2 25%, transparent 25%, transparent 50%, #d2d2d2 50%, #d2d2d2 75%, transparent 75%, transparent)',
    backgroundSize: '40px 40px'
  }
}))

function Dropzone (props) {
  const [files, setFiles] = React.useState([])
  const [drag, setDrag] = React.useState(false)
  const inputEl = React.useRef(null)

  const onDragOver = evt => {
    setDrag(true)
    evt.stopPropagation()
    evt.preventDefault()
  }

  function onDragLeave (evt) {
    setDrag(false)
  }

  async function onDrop (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    const files = Array.from(evt.dataTransfer.files)
    setFiles(files)

    const actions = await Promise.all(
      files
        .map(file => {
          return props.action(file)
            .then(action => [file, action])
        })
    )

    await Promise.all(actions.map(
      ([file, action]) => props.customRequest({ action, headers: {}, file, onSuccess: () => {} }))
    )
  }

  function onChange (evt) {
    const files = Array.from(inputEl.files)
  }

  const classes = useDropzoneStyles(props)

  return (
    <div
      onDrop={onDrop}
      className={clsx(classes.dropzone, { [classes.drag]: drag })}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/*<input type={'file'} ref={inputEl} onChange={onChange} />*/}
    </div>
  )
}

const useThumbnailStyles = makeStyles(theme => ({
  thumbnail: {
    width: 100,
    height: 100,
    margin: '0 10px 0 0',
    position: 'relative',
    padding: 10,
    boxSizing: 'border-box',
    borderRadius: 3,
    cursor: 'pointer',
    // '& img': {
    //   width: '100%',
    //   height: '100%',
    //   objectFit: 'cover'
    // },
    // '&.hover': {
    //   img {
    //     filter: grayscale(50%) brightness(50%);
    //   }
    // }
  },
  selected: {
    border: '3px solid #d9f7be'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',

    // button {
    //   all: unset;
    //   cursor: pointer;
    //   margin: 5px;
    //   padding: 2px;
    //   box-sizing: border-box;
    //   opacity: 0.9;
    //   border: 0.5px solid transparent;
    //   cursor: pointer;
  
    //   &:hover {
    //     opacity: 1;
    //     background-color: rgba(244, 249, 253, 0.3);
    //   }
    // }
  }
}))

function Thumbnail (props) {
  const { selected } = props
  const [hover, setHover] = React.useState(false)

  const onMouseEnter = () => setHover(true)
  const onMouseLeave = () => setHover(false)

  function onClick (evt) {
    props.onSelect(props.fileId)
  }

  function onDelete (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    props.deleteImage({ id: props.fileId })
  }

  const classes = useThumbnailStyles(props)

  return (
    <figure
      className={clsx(classes.thumbnail, {
        [classes.selected]: selected,
        [classes.hover]: hover
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <img src={props.src} />
      {
        hover && (
          <div className={classes.overlay}>
            <div className={classes.toolbar}>
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        )
      }
    </figure>
  )
}

const useThumbnailUploadStyles = makeStyles(theme => ({
  flex: {
    display: 'flex'
  }
}))

function ThumbnailUpload (props) {
  const {
    fileList,
    action,
    customRequest,
    onSelect,
    coverImage,
    deleteImage
  } = props
  const classes = useThumbnailUploadStyles(props)

  return (
    <div className={classes.flex}>
      {
        fileList.map(item => {
          return (
            <Thumbnail
              key={item.id}
              fileId={item.id}
              src={item.url}
              onSelect={onSelect}
              selected={coverImage === item.id}
              deleteImage={deleteImage}
            />
          )
        })
      }
      <Dropzone
        action={action}
        customRequest={customRequest}
      />
    </div>
  )
}

ThumbnailUpload.propTypes = {
  fileList: PropTypes.array.isRequired,
  customRequest: PropTypes.func.isRequired,
  beforeUpload: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired
}

export default ThumbnailUpload

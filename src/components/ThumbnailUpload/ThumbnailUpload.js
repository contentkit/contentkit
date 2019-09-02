import React from 'react'
import PropTypes from 'prop-types'
import classes from './styles.scss'
import clsx from 'clsx'

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
    console.log(evt)
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
    console.log(files)
  }

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
              <button onClick={onDelete}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        )
      }
    </figure>
  )
}

function ThumbnailUpload (props) {
  const {
    fileList,
    action,
    customRequest,
    onSelect,
    coverImage,
    deleteImage
  } = props
  console.log({ coverImage })
  return (
    <div className={classes.grid}>
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

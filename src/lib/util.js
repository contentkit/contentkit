import format from 'date-fns/format'
import Haikunator from 'haikunator'

const seenKeys = {}
const MULTIPLIER = Math.pow(2, 24)

export const genKey = () => {
  let key
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32)
  }
  seenKeys[key] = true
  return key
}

export const genDate = () => {
  return format(new Date())
}

export const wrapWithLoadingState = async (update, asyncFn, isUnmounted) => {
  if (isUnmounted()) {
    console.warn('Component is unmounted!')
    return
  }
  let shouldProceed = await new Promise((resolve, reject) => {
    update(prevState => {
      if (prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to true')
        resolve(false)
        return null
      }
      resolve(true)
      return { loading: true }
    })
  })
  if (!shouldProceed) return
  await asyncFn()
  window.requestIdleCallback(
    () => update(prevState => {
      if (!prevState.loading || isUnmounted()) {
        console.warn('Could not update loading state to false')
        return null
      }
      return { loading: false }
    })
  )
}

export const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const haikunator = new Haikunator()

export const genProjectName = () => haikunator.haikunate()

export const findIndex = (arr, fn) => {
  let index = 0
  while (index < arr.length) {
    if (fn(arr[index])) {
      break
    }
    index++
  }
  return index >= arr.length ? -1 : index
}

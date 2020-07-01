import { useState, useEffect } from 'react'

const store = {}

const usePersistentState = (key, defaultState) => {
  if (!store[key]) {
    store[key] = {
      state: null,
      setters: new Set(),
      get: () => store[key].state,
      set: (state) => {
        state = { ...(store[key].state || {}), ...state }
        store[key].state = state
        store[key].setters.forEach((setter) => setter(state))
      }
    }
  }

  // sets defaultState
  if (defaultState && !store[key].state) {
    store[key].state = defaultState
  }

  const [state, setState] = useState(store[key].state)
  useEffect(() => {
    store[key].setters.add(setState)
    return () => {
      if (store[key].setters.has(setState)) {
        store[key].setters.delete(setState)
      }
    }
  }, [])
  return [state, store[key].set]
}

export const getPersistentState = (key) => store[key].state

export default usePersistentState
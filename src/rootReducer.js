import getInitialState from './initialState'

const rootReducer = (state = getInitialState(), action) => {
  if (!action.reducer) return state // fallback for actions from different sources
  if (action.path) {
    throw new Error(`Support for paths have been removed! (type: ${action.type})`)
  }
  return action.reducer(state, action.payload)
}

export default rootReducer

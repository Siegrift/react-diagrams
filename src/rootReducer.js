// @flow
import getInitialState from './initialState'

import type { State, GenericAction } from './flow/reduxTypes'

const rootReducer = (state: State = getInitialState(), action: GenericAction<*>) => {
  if (!action.reducer) return state // fallback for actions from different sources
  return action.reducer(state, action.payload)
}

export default rootReducer

// @flow
import { setIn } from './imuty'

import type { Path } from './flow/commonTypes'
import type { State, GenericAction } from './flow/reduxTypes'

type SetValueOptions = { type?: string, undoable?: boolean, loggable?: boolean }

const isLoggable = (options?: SetValueOptions) => {
  if (options && options.hasOwnProperty('loggable')) return options.loggable
  return true
}

const isUndoable = (options?: SetValueOptions) => {
  if (options && options.hasOwnProperty('undoable')) return options.undoable
  return true
}

export const setValueAt = (path: Path, value: any, other?: SetValueOptions) => ({
  type: (other && other.type) || `Set value at ${path.toString()}`,
  payload: value,
  undoable: isUndoable(other),
  loggable: isLoggable(other),
  reducer: (state: State) => setIn(state, path, value),
})

export const checkpoint = (): GenericAction<*> => ({
  type: 'Trigger save',
  undoable: true,
  reducer: (state: State) => state,
})

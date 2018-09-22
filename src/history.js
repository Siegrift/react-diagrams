// @flow
import { addToHistory } from './diagramEditor/actions'
import { UNDO_REDO_FILTERS } from './objectFilterPaths'
import { filterObject } from './imuty'

import type { Dispatch, MiddlewareProps, GenericAction } from './flow/reduxTypes'

const historyMiddleware = ({ dispatch, getState }: MiddlewareProps) => (next: Dispatch) => (
  action: GenericAction<*>
): null => {
  const prevState = getState()
  next(action)
  const nextState = getState()
  if (
    action.undoable &&
    (typeof action.undoable !== 'function' || action.undoable(prevState, nextState))
  ) {
    dispatch(addToHistory(filterObject(nextState, ...UNDO_REDO_FILTERS)))
  }
  return null
}

export default historyMiddleware

import { addToHistory } from './diagramEditor/actions'
import { undoRedoFilters } from './objectFilterPaths'
import { filterObject } from './imuty'

const historyMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  const prevState = getState()
  next(action)
  const nextState = getState()
  if (
    action.undoable &&
    (typeof action.undoable !== 'function' || action.undoable(prevState, nextState))
  ) {
    dispatch(addToHistory(filterObject(nextState, ...undoRedoFilters)))
  }
}

export default historyMiddleware

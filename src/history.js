import { addToHistory } from './DiagramEditor/actions'
import { undoRedoFilter } from './constants'
import { filterObject } from './utils/helpers'

const historyMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  const prevState = getState()
  next(action)
  const nextState = getState()
  if ((action.undoable) && (typeof action.undoable !== 'function' || action.undoable(prevState, nextState))) {
    dispatch(addToHistory(filterObject(nextState, undoRedoFilter)))
  }
}

export default historyMiddleware

import { PATH_TOPBAR_HEIGHT, PATH_SIDEBAR_WIDTH, PATH_HISTORY, PATH_HISTORY_INDEX, undoableSelector, redoableSelector } from './state'
import { setIn, getIn } from 'immutable'
import { deepMergeFilterObject } from '../utils/helpers'
import { undoRedoFilter } from '../constants'

export const changeTopbarHeight = (height) => ({
  type: 'Change topbar height',
  payload: height,
  reducer: (state) => setIn(state, PATH_TOPBAR_HEIGHT, height),
})

export const changeSidebarWidth = (width) => ({
  type: 'Change sidebar width',
  payload: width,
  reducer: (state) => setIn(state, PATH_SIDEBAR_WIDTH, width),
})

const handleKeyStroke = ({ keyCode, ctrlKey, shiftKey }) => (dispatch) => {
  console.log(`KEY STROKE: ${keyCode} ${ctrlKey} ${shiftKey}`)
}

export const checkpoint = () => ({
  type: 'Trigger save',
  undoable: true,
  reducer: (state) => state,
})

export const initializeEditor = () => (dispatch, getState, { logger }) => {
  logger.log('Initialize editor')
  dispatch(checkpoint())
  const keyPressHandler = (e) => dispatch(handleKeyStroke(e))
  document.onkeypress = keyPressHandler
}

export const addToHistory = (stateToAdd) => ({
  type: 'Add to history',
  reducer: (state) => {
    const history = [...getIn(state, PATH_HISTORY)], index = getIn(state, PATH_HISTORY_INDEX)
    history.splice(index + 1, history.length, stateToAdd)
    const newState = setIn(state, PATH_HISTORY, history)
    return setIn(newState, PATH_HISTORY_INDEX, history.length - 1)
  },
})

export const undo = () => ({
  type: 'Undo',
  reducer: (state) => {
    if (!undoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY), index = getIn(state, PATH_HISTORY_INDEX)
    const newState = deepMergeFilterObject(state, undoRedoFilter, history[index - 1])
    return setIn(newState, PATH_HISTORY_INDEX, index - 1)
  },
})

export const redo = () => ({
  type: 'Redo',
  reducer: (state) => {
    if (!redoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY), index = getIn(state, PATH_HISTORY_INDEX)
    const newState = deepMergeFilterObject(state, undoRedoFilter, history[index + 1])
    return setIn(newState, PATH_HISTORY_INDEX, index + 1)
  },
})

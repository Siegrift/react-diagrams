// @flow
import { omit, map } from 'lodash'
import { getIn, setIn, filterObject, multiSetIn } from '../imuty'
import { LOCAL_STORAGE_PATH } from '../constants'
import { SAVE_FILTERS, UNDO_REDO_FILTERS } from '../objectFilterPaths'
import {
  PATH_HISTORY,
  PATH_HISTORY_INDEX,
  cancelableSelector,
  redoableSelector,
  undoableSelector,
} from './state'
import { PATH_PORTS } from './mainEditor/ports/state'
import { PATH_WIDGETS } from './mainEditor/widgets/state'
import { currentLinkSelector } from './mainEditor/links/selectors'
import {
  selectedWidgetsSelector,
  selectedPortsSelector,
  widgetsSelector,
} from './mainEditor/widgets/selectors'
import { cancelCurrentSelection, setSelectedPort } from './mainEditor/actions'
import { selectedNodesSelector } from './mainEditor/selectors'
import { portsSelector } from './mainEditor/ports/selectors'
import { keyboardEventToString } from './diagramUtils'
import { checkpoint, setValueAt } from '../generalActions'
import { linksToDeleteSelector, linksSelector } from './mainEditor/links/selectors'
import { PATH_LINKS } from './mainEditor/links/state'
import { removeLinkPoints } from './mainEditor/linkPoints/actions'

import type { State, Dispatch, GetState, Logger } from '../flow/reduxTypes'
import type { Path, Node } from '../flow/commonTypes'

export type Shortcut = {
  keyStroke: string,
  action: (dispatch: Dispatch, getState: GetState) => null,
}

// NOTE: filteredState does not have every State property
export const addToHistory = (filteredState: State) => ({
  type: 'Add to history',
  payload: filteredState,
  reducer: (state: State) => {
    const history = [...getIn(state, PATH_HISTORY)],
      index = getIn(state, PATH_HISTORY_INDEX)
    history.splice(index + 1, history.length, filteredState)
    const newState = setIn(state, PATH_HISTORY, history)
    return setIn(newState, PATH_HISTORY_INDEX, history.length - 1)
  },
})

export const undo = () => ({
  type: 'Undo',
  reducer: (state: State) => {
    if (!undoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY),
      index = getIn(state, PATH_HISTORY_INDEX)
    const filteredState = history[index - 1]
    return multiSetIn(
      state,
      ...UNDO_REDO_FILTERS.map((filter: Path) => [filter, getIn(filteredState, filter)]),
      [PATH_HISTORY_INDEX, index - 1]
    )
  },
})

export const redo = () => ({
  type: 'Redo',
  reducer: (state: State) => {
    if (!redoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY),
      index = getIn(state, PATH_HISTORY_INDEX)
    const filteredState = history[index + 1]
    return multiSetIn(
      state,
      ...UNDO_REDO_FILTERS.map((filter: Path) => [filter, getIn(filteredState, filter)]),
      [PATH_HISTORY_INDEX, index + 1]
    )
  },
})

export const cancelSelection = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  if (!cancelableSelector(state)) {
    return
  } else {
    dispatch(checkpoint())
    if (currentLinkSelector(getState())) dispatch(setSelectedPort(-1))
    else dispatch(cancelCurrentSelection())
  }
}

export const deleteCurrentSelection = () => (
  dispatch: Dispatch,
  getState: GetState,
  logger: Logger
) => {
  logger.log('Delete current selection')
  dispatch(
    setValueAt(
      [],
      multiSetIn(
        getState(),
        // remove selected widgets
        [
          PATH_WIDGETS,
          omit(
            widgetsSelector(getState()),
            map(selectedWidgetsSelector(getState()), (node: Node) => node.editorKey)
          ),
        ],
        // remove selected widget ports
        [
          PATH_PORTS,
          omit(
            portsSelector(getState()),
            map(selectedPortsSelector(getState()), (node: Node) => node.editorKey)
          ),
        ],
        // remove selected links (link points are harder as they make changes also in links)
        [
          PATH_LINKS,
          omit(
            linksSelector(getState()),
            map(linksToDeleteSelector(getState()), (node: Node) => node.editorKey)
          ),
        ]
      ),
      { loggable: false, undoable: false }
    )
  )
  dispatch(removeLinkPoints())
}

export const deleteSelection = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  if (!selectedNodesSelector(state).length) {
    return
  } else {
    dispatch(checkpoint())
    dispatch(deleteCurrentSelection())
  }
}

export const localStorageSave = () => (dispatch: Dispatch, getState: GetState, logger: Logger) => {
  logger.log('Save editor state')
  localStorage.setItem(
    LOCAL_STORAGE_PATH,
    JSON.stringify(filterObject(getState(), ...SAVE_FILTERS))
  )
}

export const localStorageLoad = () => ({
  type: 'Load editor state',
  reducer: (state: State) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_PATH)
    if (!storage) return state
    const loadedFilteredState = JSON.parse(storage)
    return multiSetIn(
      state,
      ...SAVE_FILTERS.map((filter: Path) => [filter, getIn(loadedFilteredState, filter)])
    )
  },
})

export const shortcuts = [
  {
    keyStroke: 'Ctrl+KeyZ',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(undo()),
  },
  {
    keyStroke: 'Ctrl+Shift+KeyZ',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(redo()),
  },
  {
    keyStroke: 'Escape',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(cancelSelection()),
  },
  {
    keyStroke: 'Delete',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(deleteSelection()),
  },
]

const handleKeyStroke = (event: KeyboardEvent) => (
  dispatch: Dispatch,
  getState: GetState,
  logger: Logger
) => {
  const eventKeyStroke = keyboardEventToString(event)
  logger.log(`Handling key stroke: ${eventKeyStroke}`)
  const shortcut = shortcuts.find((shortcut: Shortcut) => shortcut.keyStroke === eventKeyStroke)
  if (shortcut) shortcut.action(dispatch, getState)
}

export const initializeEditor = () => (dispatch: Dispatch, getState: GetState, logger: Logger) => {
  logger.log('Initialize editor')
  dispatch(checkpoint())
  const keyDownHandler = (e: KeyboardEvent) => dispatch(handleKeyStroke(e))
  document.addEventListener('keydown', keyDownHandler)
}

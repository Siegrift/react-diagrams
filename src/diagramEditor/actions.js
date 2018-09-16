// @flow
import { getIn, setIn, filterObject, multiSetIn } from '../imuty'
import { concat, reduce } from 'lodash'
import { LOCAL_STORAGE_PATH } from '../constants'
import { saveFilters, undoRedoFilters } from '../objectFilterPaths'
import {
  PATH_HISTORY,
  PATH_HISTORY_INDEX,
  PATH_SIDEBAR_WIDTH,
  PATH_TOPBAR_HEIGHT,
  cancelableSelector,
  redoableSelector,
  undoableSelector,
} from './state'
import { PATH_LINKS } from './links/state'
import { PATH_WIDGETS } from './widgets/state'
import { currentLinkSelector, linksSelector } from './links/selectors'
import { widgetsSelector } from './widgets/selectors'
import { cancelCurrentSelection, setSelectedPort } from './mainEditor/actions'
import { selectedNodesSelector } from './mainEditor/selectors'
import { shortcuts } from './shortcuts'
import { linkPointsSelector } from './linkPoints/selectors'
import { PATH_LINK_POINTS } from './linkPoints/state'
import { keyboardEventToString } from './diagramUtils'
import { checkpoint } from '../generalActions'

import type { State, Dispatch, GetState, Logger } from '../flow/reduxTypes'
import type { Path, EditorKey } from '../flow/commonTypes'
import type { Shortcut } from './shortcuts'

export const changeTopbarHeight = (height: number) => ({
  type: 'Change topbar height',
  payload: height,
  reducer: (state: State) => setIn(state, PATH_TOPBAR_HEIGHT, height),
})

export const changeSidebarWidth = (width: number) => ({
  type: 'Change sidebar width',
  payload: width,
  reducer: (state: State) => setIn(state, PATH_SIDEBAR_WIDTH, width),
})

const handleKeyStroke = (event: KeyboardEvent) => (
  dispatch: Dispatch,
  getState: GetState,
  logger: Logger
) => {
  const eventKeyStroke = keyboardEventToString(event)
  logger.log(`Handling key stroke: ${eventKeyStroke}`)
  // FLOW: the argument is definitely Shortcut
  const shortcut = shortcuts.find((shortcut: Shortcut) => shortcut.keyStroke === eventKeyStroke)
  if (shortcut) shortcut.action(dispatch, getState)
}

export const initializeEditor = () => (dispatch: Dispatch, getState: GetState, logger: Logger) => {
  logger.log('Initialize editor')
  dispatch(checkpoint())
  const keyDownHandler = (e: KeyboardEvent) => dispatch(handleKeyStroke(e))
  document.addEventListener('keydown', keyDownHandler)
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
      ...undoRedoFilters.map((filter: Path) => [filter, getIn(filteredState, filter)]),
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
      ...undoRedoFilters.map((filter: Path) => [filter, getIn(filteredState, filter)]),
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

// FIXME: deletion on links doesn't work, refactor same way as mouse move, rename selectors
export const deleteCurrentSelection = () => ({
  type: 'Delete current selection',
  reducer: (state: State) => {
    const selectedNodes = selectedNodesSelector(state)
    let newState = state,
      newLinks = linksSelector(state)
    const newWidgets = reduce(
      widgetsSelector(newState),
      (acc: Object, widget: any, key: EditorKey) => {
        if (widget.selected) {
          const widgetPorts = concat(widget.inPortKeys, widget.outPortKeys)
          newLinks = reduce(
            newLinks,
            (acc: Object, link: any, linkKey: EditorKey) => {
              if (widgetPorts.includes(link.source) || widgetPorts.includes(link.target)) {
                return acc
              }
              return { ...acc, [linkKey]: link }
            },
            {}
          )
          return acc
        } else {
          return { ...acc, [key]: widget }
        }
      },
      {}
    )
    // TODO: remove points and links with less than 2 points
    const newLinkPoints = reduce(
      linkPointsSelector(newState),
      (acc: Object, linkPoint: any, key: EditorKey) => {
        if (selectedNodes.includes(key)) return acc
        else return { ...acc, [key]: { ...linkPoint } }
      },
      {}
    )
    newState = setIn(newState, PATH_WIDGETS, newWidgets)
    newState = setIn(newState, PATH_LINKS, newLinks)
    newState = setIn(newState, PATH_LINK_POINTS, newLinkPoints)
    return newState
  },
})

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
  localStorage.setItem(LOCAL_STORAGE_PATH, JSON.stringify(filterObject(getState(), ...saveFilters)))
}

export const localStorageLoad = () => ({
  type: 'Load editor state',
  reducer: (state: State) => {
    // FLOW: check if the item is in local storage is outside this method
    const loadedFilteredState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PATH))
    return multiSetIn(
      state,
      ...saveFilters.map((filter: Path) => [filter, getIn(loadedFilteredState, filter)])
    )
  },
})

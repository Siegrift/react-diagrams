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
import shortcuts from './shortcuts'
import { linkPointsSelector } from './linkPoints/selectors'
import { PATH_LINK_POINTS } from './linkPoints/state'
import { keyboardEventToString } from './diagramUtils'

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

const handleKeyStroke = (event) => (dispatch, getState, { logger }) => {
  const eventKeyStroke = keyboardEventToString(event)
  const shortcut = shortcuts.find((shortcut) => shortcut.keyStroke === eventKeyStroke)
  if (shortcut) shortcut.action(dispatch, getState)
}

export const checkpoint = () => ({
  type: 'Trigger save',
  undoable: true,
  reducer: (state) => state,
})

export const initializeEditor = () => (dispatch, getState, { logger }) => {
  logger.log('Initialize editor')
  dispatch(checkpoint())
  const keyDownHandler = (e) => dispatch(handleKeyStroke(e))
  document.onkeydown = keyDownHandler
}

export const addToHistory = (stateToAdd) => ({
  type: 'Add to history',
  reducer: (state) => {
    const history = [...getIn(state, PATH_HISTORY)],
      index = getIn(state, PATH_HISTORY_INDEX)
    history.splice(index + 1, history.length, stateToAdd)
    const newState = setIn(state, PATH_HISTORY, history)
    return setIn(newState, PATH_HISTORY_INDEX, history.length - 1)
  },
})

export const undo = () => ({
  type: 'Undo',
  reducer: (state) => {
    if (!undoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY),
      index = getIn(state, PATH_HISTORY_INDEX)
    const filteredState = history[index - 1]
    return multiSetIn(
      state,
      ...undoRedoFilters.map((filter) => [filter, getIn(filteredState, filter)]),
      [PATH_HISTORY_INDEX, index - 1]
    )
  },
})

export const redo = () => ({
  type: 'Redo',
  reducer: (state) => {
    if (!redoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY),
      index = getIn(state, PATH_HISTORY_INDEX)
    const filteredState = history[index + 1]
    return multiSetIn(
      state,
      ...undoRedoFilters.map((filter) => [filter, getIn(filteredState, filter)]),
      [PATH_HISTORY_INDEX, index + 1]
    )
  },
})

export const cancelSelection = () => (dispatch, getState) => {
  const state = getState()
  if (!cancelableSelector(state)) {
    return
  } else {
    dispatch(checkpoint())
    if (currentLinkSelector(getState())) dispatch(setSelectedPort(-1))
    else dispatch(cancelCurrentSelection())
  }
}

export const deleteCurrentSelection = () => ({
  type: 'Delete current selection',
  reducer: (state) => {
    const selectedNodes = selectedNodesSelector(state)
    let newState = state,
      newLinks = linksSelector(state)
    const newWidgets = reduce(
      widgetsSelector(newState),
      (acc, widget, key) => {
        if (widget.selected) {
          const widgetPorts = concat(widget.inPortKeys, widget.outPortKeys)
          newLinks = reduce(
            newLinks,
            (acc, link, linkKey) => {
              if (widgetPorts.includes(link.source) || widgetPorts.includes(link.destination)) {
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
      (acc, linkPoint, key) => {
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

export const deleteSelection = () => (dispatch, getState) => {
  const state = getState()
  if (!selectedNodesSelector(state).length) {
    return
  } else {
    dispatch(checkpoint())
    dispatch(deleteCurrentSelection())
  }
}

export const localStorageSave = () => (dispatch, getState, { logger }) => {
  logger.log('Save editor state')
  localStorage.setItem(LOCAL_STORAGE_PATH, JSON.stringify(filterObject(getState(), ...saveFilters)))
}

export const localStorageLoad = () => ({
  type: 'Load editor state',
  reducer: (state) => {
    const loadedFilteredState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PATH))
    return multiSetIn(
      state,
      ...saveFilters.map((filter) => [filter, getIn(loadedFilteredState, filter)])
    )
  },
})

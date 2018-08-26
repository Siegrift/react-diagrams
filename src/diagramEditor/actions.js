import { getIn, setIn } from 'immutable'
import { concat, reduce, forEach } from 'lodash'
import { deepMergeFilterObject, filterObject } from '../utils'
import { LOCAL_STORAGE_PATH, saveFilter, undoRedoFilter } from '../constants'
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
import { graphlib, layout } from 'dagre'
import { portByEditorKeySelector } from './ports/selectors'

const keyboardEventToString = (event) => {
  const mods = []
  if (event.ctrlKey) mods.push('Ctrl')
  if (event.shiftKey) mods.push('Shift')
  if (event.altKey) mods.push('Alt')
  mods.push(event.code)
  return mods.join('+')
}

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
  //console.log(`KEY STROKE ${eventKeyStroke}`)
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
    const newState = deepMergeFilterObject(state, undoRedoFilter, history[index - 1])
    return setIn(newState, PATH_HISTORY_INDEX, index - 1)
  },
})

export const redo = () => ({
  type: 'Redo',
  reducer: (state) => {
    if (!redoableSelector(state)) return state
    const history = getIn(state, PATH_HISTORY),
      index = getIn(state, PATH_HISTORY_INDEX)
    const newState = deepMergeFilterObject(state, undoRedoFilter, history[index + 1])
    return setIn(newState, PATH_HISTORY_INDEX, index + 1)
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
    newLinks = reduce(
      newLinks,
      (acc, link, key) => {
        const newPoints = link.path.filter((point) => !selectedNodes.includes(point.editorKey))
        if (selectedNodes.includes(key) || newPoints.length <= 2) return acc
        else return { ...acc, [key]: { ...link, path: newPoints } }
      },
      {}
    )
    newState = setIn(newState, PATH_WIDGETS, newWidgets)
    newState = setIn(newState, PATH_LINKS, newLinks)
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
  localStorage.setItem(LOCAL_STORAGE_PATH, JSON.stringify(filterObject(getState(), saveFilter)))
}

export const localStorageLoad = () => ({
  type: 'Load editor state',
  reducer: (state) =>
    deepMergeFilterObject(state, saveFilter, JSON.parse(localStorage.getItem(LOCAL_STORAGE_PATH))),
})

// TODO: also take into account link points
export const formatDiagrams = () => ({
  type: 'Format diagrams',
  reducer: (state) => {
    const g = new graphlib.Graph()
    g.setGraph({})
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(() => ({}))
    const widgets = widgetsSelector(state)
    const links = linksSelector(state)

    forEach(widgets, ({ editorKey }) => {
      // TODO: remember ref in state
      const element = document.getElementById(editorKey)
      g.setNode(editorKey, { width: element.clientWidth, height: element.clientHeight })
    })

    forEach(links, ({ source, destination }) => {
      const sourceWidget = portByEditorKeySelector(state, source).widgetEditorKey
      const destinationWidget = portByEditorKeySelector(state, destination).widgetEditorKey
      g.setEdge(sourceWidget, destinationWidget)
    })

    layout(g)
    console.warn('Format not yet ready!')
    // TODO: make affect on state
    return state
  },
})

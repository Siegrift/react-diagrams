import { pick, reduce, uniqueId } from 'lodash'
import { setIn, multiSetIn } from '../../imuty'
import { MIN_ZOOM } from '../../constants'
import { PATH_CURSOR, PATH_DRAGGING, PATH_EDITOR_BOUNDS, PATH_ZOOM, PATH_OFFSET } from './state'
import { PATH_LINKS, getLinkPathByEditorKey, PATH_CURRENT_LINK } from '../links/state'
import { getLinkByEditorKey, linksSelector, linksToMoveSelector } from '../links/selectors'
import { moveSelectedLinks } from '../links/actions'
import {
  zoomSelector,
  relativeMousePoint,
  cursorSelector,
  draggingSelector,
  offsetSelector,
} from './selectors'
import { createPorts } from '../ports/portUtils'
import { addPorts } from '../ports/actions'
import { moveSelectedWidgets } from '../widgets/actions'
import { moveSelectedLinkPoints } from '../linkPoints/actions'
import { getWidgetPathByEditorKey, PATH_WIDGETS } from '../widgets/state'
import { widgetsSelector, getWidgetByEditorKey, widgetsToMoveSelector } from '../widgets/selectors'
import {
  linkPointsSelector,
  linkPointByEditorKeySelector,
  linkPointsToMoveSelector,
} from '../linkPoints/selectors'
import { PATH_LINK_POINTS, linkPointPathByEditorKey } from '../linkPoints/state'
import { setValueAt } from '../../generalActions'

export const setDragging = (dragging) => ({
  type: `Set dragging to ${dragging}`,
  payload: dragging,
  reducer: (state) => setIn(state, PATH_DRAGGING, dragging),
})

const addWidget = (command, pos, portKeys, widgetEditorKey) => ({
  type: 'Add widget to editor',
  payload: { command, pos, portKeys, widgetEditorKey },
  undoable: true,
  reducer: (state) => {
    return setIn(state, getWidgetPathByEditorKey(widgetEditorKey), {
      ...pick(command, ['name', 'desc', 'color']),
      inPortKeys: portKeys.in,
      outPortKeys: portKeys.out,
      ...relativeMousePoint(state, pos),
      editorKey: widgetEditorKey,
      selected: false,
    })
  },
})

// TODO: move  to widget actions
export const onWidgetDrop = (command, pos) => (dispatch, getState) => {
  const widgetEditorKey = uniqueId()
  const { inPorts, outPorts } = createPorts(command, widgetEditorKey)
  // TODO: why exactly has to be this called?
  dispatch(setDragging(false))
  dispatch(addPorts(inPorts, outPorts))
  dispatch(
    addWidget(
      command,
      pos,
      {
        in: inPorts.map((p) => p.editorKey),
        out: outPorts.map((p) => p.editorKey),
      },
      widgetEditorKey
    )
  )
}

export const cancelCurrentSelection = () => ({
  type: 'Cancel current selection',
  reducer: (state) => {
    const widgets = reduce(
      widgetsSelector(state),
      (acc, value, key) => ({ ...acc, [key]: { ...value, selected: false } }),
      {}
    )
    const links = reduce(
      linksSelector(state),
      (acc, value, key) => ({
        ...acc,
        [key]: {
          ...value,
          selected: false,
        },
      }),
      {}
    )
    const linkPoints = reduce(
      linkPointsSelector(state),
      (acc, value, key) => ({
        ...acc,
        [key]: {
          ...value,
          selected: false,
        },
      }),
      {}
    )
    return multiSetIn(
      state,
      [PATH_WIDGETS, widgets],
      [PATH_LINKS, links],
      [PATH_LINK_POINTS, linkPoints]
    )
  },
})

export const addToCurrentSelection = (nodeKey) => ({
  type: 'Add to current selection',
  undoable: true,
  payload: nodeKey,
  reducer: (state) => {
    let newState = state
    if (getWidgetByEditorKey(newState, nodeKey)) {
      newState = setIn(
        newState,
        [...getWidgetPathByEditorKey(nodeKey), 'selected'],
        !getWidgetByEditorKey(newState, nodeKey).selected
      )
    }
    if (getLinkByEditorKey(newState, nodeKey)) {
      newState = setIn(
        newState,
        [...getLinkPathByEditorKey(nodeKey), 'selected'],
        !getLinkByEditorKey(newState, nodeKey).selected
      )
    }
    if (linkPointByEditorKeySelector(nodeKey)(newState)) {
      newState = setIn(
        newState,
        [...linkPointPathByEditorKey(nodeKey), 'selected'],
        !linkPointByEditorKeySelector(nodeKey)(newState).selected
      )
    }
    return newState
  },
})

export const setSelectedNode = (nodeKey, onlyAppend) => (dispatch) => {
  if (!onlyAppend) dispatch(cancelCurrentSelection())
  if (nodeKey === -1) throw new Error('Use cancel current selection')
  dispatch(addToCurrentSelection(nodeKey))
  dispatch(setDragging(true))
}

export const setEditorBounds = (bounds) => ({
  type: 'Set editor bounds',
  payload: bounds,
  loggable: false,
  reducer: (state) => {
    return setIn(state, PATH_EDITOR_BOUNDS, bounds)
  },
})

export const onEditorMouseMove = (position) => (dispatch, getState) => {
  const previousCursor = cursorSelector(getState())
  dispatch(setValueAt(PATH_CURSOR, position, { loggable: false, undoable: false }))
  if (!previousCursor) return
  const diff = {
    x: (position.x - previousCursor.x) / zoomSelector(getState()),
    y: (position.y - previousCursor.y) / zoomSelector(getState()),
  }
  if (draggingSelector(getState())) {
    if (widgetsToMoveSelector(getState()).length) dispatch(moveSelectedWidgets(diff))
    if (linksToMoveSelector(getState()).length) dispatch(moveSelectedLinks(diff))
    if (linkPointsToMoveSelector(getState()).length) dispatch(moveSelectedLinkPoints(diff))
    if (
      !widgetsToMoveSelector(getState()).length &&
      !linksToMoveSelector(getState()).length &&
      !linkPointsToMoveSelector(getState()).length
    ) {
      const offset = offsetSelector(getState())
      dispatch(
        setValueAt(
          PATH_OFFSET,
          { x: offset.x + diff.x, y: offset.y + diff.y },
          { undoable: false, loggable: false }
        )
      )
    }
  }
}

// FIXME: this is sometimes called instead of onLinkMouseDoown
export const onEditorMouseDown = (point) => (dispatch, getState) => {
  dispatch(setDragging(true))
  dispatch(cancelCurrentSelection())
}

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  reducer: (state) => setIn(state, PATH_DRAGGING, false),
})

export const updateZoom = (zoomFactor) => ({
  type: 'Update zoom',
  payload: { zoomFactor },
  reducer: (state) =>
    setIn(
      state,
      PATH_ZOOM,
      Math.max(zoomSelector(state) + zoomSelector(state) * zoomFactor, MIN_ZOOM)
    ),
})

export const setSelectedPort = (editorKey, point, undoable) => ({
  type: 'Set selected port',
  payload: { editorKey, point },
  reducer: (state) =>
    setIn(
      state,
      PATH_CURRENT_LINK,
      editorKey === -1
        ? undefined
        : {
          source: editorKey,
          path: [],
          destination: undefined,
        }
    ),
})

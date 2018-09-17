// @flow
import { pick, reduce, uniqueId } from 'lodash'
import { setIn, multiSetIn } from '../../imuty'
import { MIN_ZOOM } from '../../constants'
import { PATH_CURSOR, PATH_DRAGGING, PATH_EDITOR_BOUNDS, PATH_ZOOM, PATH_OFFSET } from './state'
import { PATH_LINKS, getLinkPathByEditorKey, PATH_CURRENT_LINK } from '../links/state'
import { getLinkByEditorKey, linksSelector, selectedLinksSelector } from '../links/selectors'
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
import {
  widgetsSelector,
  getWidgetByEditorKey,
  selectedWidgetsSelector,
} from '../widgets/selectors'
import {
  linkPointsSelector,
  linkPointByEditorKeySelector,
  linkPointsToMoveSelector,
} from '../linkPoints/selectors'
import { PATH_LINK_POINTS, linkPointPathByEditorKey } from '../linkPoints/state'
import { setValueAt } from '../../generalActions'

import type { State, Dispatch, GetState } from '../../flow/reduxTypes'
import type { Position, EditorKey, BoundingBox } from '../../flow/commonTypes'
import type { Command } from '../../flow/schemaTypes'
import type { Port } from '../ports/state'
import type { Link } from '../links/state'
import type { Widget } from '../widgets/state'
import type { LinkPoint } from '../linkPoints/state'

export const setDragging = (dragging: boolean) => ({
  type: `Set dragging to ${dragging.toString()}`,
  payload: dragging,
  reducer: (state: State) => setIn(state, PATH_DRAGGING, dragging),
})

const addWidget = (
  command: Command,
  pos: Position,
  portKeys: { in: EditorKey[], out: EditorKey[] },
  widgetEditorKey: EditorKey
) => ({
  type: 'Add widget to editor',
  payload: { command, pos, portKeys, widgetEditorKey },
  undoable: true,
  reducer: (state: State) => {
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

export const onWidgetDrop = (command: Command, pos: Position) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const widgetEditorKey = uniqueId()
  const { inPorts, outPorts } = createPorts(command, widgetEditorKey)
  dispatch(setDragging(false))
  dispatch(addPorts(inPorts, outPorts))
  dispatch(
    addWidget(
      command,
      pos,
      {
        in: inPorts.map((p: Port) => p.editorKey),
        out: outPorts.map((p: Port) => p.editorKey),
      },
      widgetEditorKey
    )
  )
}

export const cancelCurrentSelection = () => ({
  type: 'Cancel current selection',
  reducer: (state: State) => {
    const widgets = reduce(
      widgetsSelector(state),
      (acc: Object, value: Widget, key: EditorKey) => ({
        ...acc,
        [key]: { ...value, selected: false },
      }),
      {}
    )
    const links = reduce(
      linksSelector(state),
      (acc: Object, value: Link, key: EditorKey) => ({
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
      (acc: Object, value: LinkPoint, key: EditorKey) => ({
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

export const addToCurrentSelection = (nodeKey: EditorKey) => ({
  type: 'Add to current selection',
  undoable: true,
  payload: nodeKey,
  reducer: (state: State) => {
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

export const setSelectedNode = (nodeKey: EditorKey, onlyAppend: boolean) => (
  dispatch: Dispatch
) => {
  if (!onlyAppend) dispatch(cancelCurrentSelection())
  if (nodeKey === -1) throw new Error('Use cancel current selection')
  dispatch(addToCurrentSelection(nodeKey))
  dispatch(setDragging(true))
}

export const setEditorBounds = (bounds: BoundingBox) => ({
  type: 'Set editor bounds',
  payload: bounds,
  loggable: false,
  reducer: (state: State) => {
    return setIn(state, PATH_EDITOR_BOUNDS, bounds)
  },
})

export const onEditorMouseMove = (position: Position) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const previousCursor = cursorSelector(getState())
  dispatch(setValueAt(PATH_CURSOR, position, { loggable: false, undoable: false }))
  if (!previousCursor) return
  const rawDiff = {
    x: position.x - previousCursor.x,
    y: position.y - previousCursor.y,
  }
  const diff = {
    x: rawDiff.x / zoomSelector(getState()),
    y: rawDiff.y / zoomSelector(getState()),
  }
  if (draggingSelector(getState())) {
    if (selectedWidgetsSelector(getState()).length) dispatch(moveSelectedWidgets(diff))
    if (selectedLinksSelector(getState()).length) dispatch(moveSelectedLinks(diff))
    if (linkPointsToMoveSelector(getState()).length) dispatch(moveSelectedLinkPoints(diff))
    if (
      !selectedWidgetsSelector(getState()).length &&
      !selectedLinksSelector(getState()).length &&
      !linkPointsToMoveSelector(getState()).length
    ) {
      const offset = offsetSelector(getState())
      dispatch(
        setValueAt(
          PATH_OFFSET,
          { x: offset.x + rawDiff.x, y: offset.y + rawDiff.y },
          { undoable: false, loggable: false }
        )
      )
    }
  }
}

export const onEditorMouseDown = (point: Position) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setDragging(true))
  dispatch(cancelCurrentSelection())
}

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  reducer: (state: State) => setIn(state, PATH_DRAGGING, false),
})

export const updateZoom = (zoomFactor: number) => ({
  type: 'Update zoom',
  payload: { zoomFactor },
  reducer: (state: State) =>
    setIn(
      state,
      PATH_ZOOM,
      Math.max(zoomSelector(state) + zoomSelector(state) * zoomFactor, MIN_ZOOM)
    ),
})

export const setSelectedPort = (
  editorKey: EditorKey | -1,
  point?: Position,
  undoable?: boolean
) => ({
  type: 'Set selected port',
  payload: { editorKey, point, undoable },
  reducer: (state: State) =>
    setIn(
      state,
      PATH_CURRENT_LINK,
      editorKey === -1
        ? undefined
        : {
          source: editorKey,
          path: [],
          target: undefined,
        }
    ),
})

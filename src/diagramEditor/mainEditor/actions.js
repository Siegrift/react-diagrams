import { pick, filter, find, map, reduce, some, uniqueId } from 'lodash'
import { setIn, multiSetIn } from '../../imuty'
import update from '../../update'
import { MIN_ZOOM } from '../../constants'
import { PATH_CURSOR, PATH_DRAGGING, PATH_EDITOR_BOUNDS, PATH_ZOOM } from './state'
import { PATH_LINKS, getLinkPathByEditorKey, PATH_CURRENT_LINK } from '../links/state'
import { getLinkByEditorKey, linksSelector } from '../links/selectors'
import {
  cursorSelector,
  draggingSelector,
  selectedNodesSelector,
  zoomSelector,
  relativeMousePoint,
} from './selectors.js'
import { createPorts } from '../ports/portUtils'
import { addPorts } from '../ports/actions'
import { getWidgetPathByEditorKey, PATH_WIDGETS } from '../widgets/state'
import { widgetsSelector, getWidgetByEditorKey } from '../widgets/selectors'
import { checkpoint } from '../actions'
import { linkPointsSelector, linkPointByEditorKeySelector } from '../linkPoints/selectors'
import { PATH_LINK_POINTS, linkPointPathByEditorKey } from '../linkPoints/state'

const computeDiff = (p1, p2) => {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

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
  dispatch(checkpoint())
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
      [PATH_LINK_POINTS, linkPoints],
    )
  },
})

export const addToCurrentSelection = (nodeKey) => ({
  type: 'Add to current selection',
  undoable: true,
  payload: nodeKey,
  reducer: (state) => {
    let newState = state
    if (getWidgetByEditorKey(state, nodeKey)) {
      newState = setIn(
        newState,
        [...getWidgetPathByEditorKey(nodeKey), 'selected'],
        !getWidgetByEditorKey(state, nodeKey).selected
      )
    }
    if (getLinkByEditorKey(state, nodeKey)) {
      newState = setIn(
        newState,
        [...getLinkPathByEditorKey(nodeKey), 'selected'],
        !getLinkByEditorKey(state, nodeKey).selected
      )
    }
    const pointKey = find(linksSelector(newState), (link) =>
      link.path.find((pointKey) => pointKey === nodeKey)
    )
    if (pointKey) {
      const linkPoint = linkPointByEditorKeySelector(pointKey)
      newState = setIn(newState, linkPointPathByEditorKey(pointKey), {
        ...linkPoint,
        selected: !linkPoint.selected,
      })
    }
    return newState
  },
})

export const setSelectedNode = (nodeKey, onlyAppend) => (dispatch) => {
  if (!onlyAppend) dispatch(cancelCurrentSelection())
  if (nodeKey === -1) throw new Error('use cancel current selection')
  dispatch(addToCurrentSelection(nodeKey))
  dispatch(setDragging(true))
}

export const setEditorBounds = (bounds) => ({
  type: 'Set editor bounds',
  payload: bounds,
  notLogable: true,
  reducer: (state) => {
    return setIn(state, PATH_EDITOR_BOUNDS, bounds)
  },
})

// TODO: split this function and also remove ports
export const onEditorMouseMove = (position) => ({
  type: 'Editor mouse move',
  payload: { position },
  notLogable: true,
  reducer: (state) => {
    let newState = setIn(state, PATH_CURSOR, position)
    if (draggingSelector(newState)) {
      const diff = computeDiff(cursorSelector(newState), cursorSelector(state))
      if (some(widgetsSelector(newState), (w) => w.selected)) {
        const selectedKeys = map(
          filter(widgetsSelector(newState), (w) => w.selected),
          (w) => w.editorKey
        )
        const newWidgets = selectedKeys.reduce((acc, key) => {
          const movedWidget = update(widgetsSelector(newState)[key], {
            x: { $sum: diff.x / zoomSelector(state) },
            y: { $sum: diff.y / zoomSelector(state) },
          })
          return { ...acc, [key]: movedWidget }
        }, {})
        let linkPoints = linkPointsSelector(newState)
        // TODO: split this reduce
        const links = reduce(
          linksSelector(newState),
          (acc, value, key) => {
            const moveLast = selectedKeys.find((key) => {
              return (
                some(
                  getWidgetByEditorKey(newState, key).outPortKeys,
                  (portKey) => portKey === value.destination
                ) ||
                some(
                  getWidgetByEditorKey(newState, key).inPortKeys,
                  (portKey) => portKey === value.destination
                )
              )
            })
            const moveFirst = selectedKeys.find((key) => {
              return (
                some(
                  getWidgetByEditorKey(newState, key).inPortKeys,
                  (portKey) => portKey === value.source
                ) ||
                some(
                  getWidgetByEditorKey(newState, key).outPortKeys,
                  (portKey) => portKey === value.source
                )
              )
            })
            if (moveFirst) {
              const key = value.path[0]
              linkPoints = {
                ...linkPoints,
                [key]: {
                  ...linkPoints[key],
                  x: linkPoints[key].x + diff.x / zoomSelector(newState),
                  y: linkPoints[key].y + diff.y / zoomSelector(newState),
                },
              }
            }
            if (moveLast) {
              const key = value.path[value.path.length - 1]
              linkPoints = {
                ...linkPoints,
                [key]: {
                  ...linkPoints[key],
                  x: linkPoints[key].x + diff.x / zoomSelector(newState),
                  y: linkPoints[key].y + diff.y / zoomSelector(newState),
                },
              }
            }
            return { ...acc, [key]: value }
          },
          {}
        )
        newState = {
          ...newState,
          widgets: { ...widgetsSelector(newState), ...newWidgets },
          links: { ...linksSelector(newState), ...links },
          linkPoints,
        }
      }

      if (some(linksSelector(newState), (link) => link.selected)) {
        const selectedKeys = map(
          filter(linksSelector(newState), (link) => link.selected),
          (link) => link.editorKey
        )
        const newLinks = selectedKeys.reduce((acc, key) => {
          const movedLink = update(linksSelector(newState)[key], {
            path: {
              $set: linksSelector(newState)[key].path.map((point, index) => {
                if (index === 0 || index === linksSelector(newState)[key].path.length - 1) {
                  return point
                }
                return {
                  ...point,
                  x: point.x + diff.x / zoomSelector(state),
                  y: point.y + diff.y / zoomSelector(state),
                }
              }),
            },
          })
          return { ...acc, [key]: movedLink }
        }, {})
        newState = {
          ...newState,
          links: { ...linksSelector(newState), ...newLinks },
        }
      }

      if (some(linksSelector(newState), (link) => some(link.path, (point) => point.selected))) {
        const newLinks = reduce(
          linksSelector(newState),
          (acc, link, key) => {
            return {
              ...acc,
              [key]: {
                ...link,
                path: link.path.map((point) => {
                  if (!selectedNodesSelector(state).includes(link.editorKey) && point.selected) {
                    return {
                      ...point,
                      x: point.x + diff.x / zoomSelector(state),
                      y: point.y + diff.y / zoomSelector(state),
                    }
                  } else {
                    return point
                  }
                }),
              },
            }
          },
          {}
        )
        newState = { ...newState, links: newLinks }
      }
      if (!selectedNodesSelector(state).length) {
        newState = update(newState, {
          editor: {
            canvas: {
              offset: {
                x: { $sum: diff.x },
                y: { $sum: diff.y },
              },
            },
          },
        })
      }
    }
    return newState
  },
})

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

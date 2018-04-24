import {
  PATH_EDITOR_REF,
  PATH_CURSOR,
  PATH_ZOOM,
  PATH_CURRENT_LINK,
  PATH_LINKS,
  selectedNodesSelector,
  cursorSelector,
  linksSelector,
  PATH_WIDGETS,
  widgetsSelector,
  PATH_DRAGGING,
  draggingSelector,
  zoomSelector,
  getWidgetByEditorKey,
  getWidgetPathByEditorKey,
  getLinkByEditorKey,
  editorRefSelector,
  getLinkPathByEditorKey,
  offsetSelector,
} from './state'
import { uniqueId, reduce, some, map, filter, find } from 'lodash'
import update from '../../utils/update'
import { setIn } from 'immutable'

const computeDiff = (p1, p2) => {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

export const relativeMousePoint = (state, { x, y }) => {
  const boundingRect = editorRefSelector(state).getBoundingClientRect()
  const zoom = zoomSelector(state), offset = offsetSelector(state)
  return {
    x: (x - boundingRect.left - boundingRect.width * (1 - zoom) / 2 - offset.x) / zoom,
    y: (y - boundingRect.top - boundingRect.height * (1 - zoom) / 2 - offset.y) / zoom,
  }
}

export const setDragging = (dragging) => ({
  type: `Set dragging to ${dragging}`,
  payload: dragging,
  reducer: (state) => setIn(state, PATH_DRAGGING, dragging),
})

export const addWidget = (command, pos) => ({
  type: 'Add widget to editor',
  payload: { command, pos },
  reducer: (state) => {
    const id = uniqueId()
    const adjustedPos = relativeMousePoint(state, pos)
    const newState = setDragging(false).reducer(state) // TODO hack
    return setIn(newState, [...PATH_WIDGETS, id], {
      ...command,
      inPorts: command.inPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
      outPorts: command.outPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
      ...adjustedPos,
      editorKey: id,
      selected: false,
    })
  },
})

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
          path: value.path.map((point) => ({ ...point, selected: false, asdasd: 'ahoj' })),
          selected: false,
        },
      }),
      {}
    )
    const newState = setIn(state, PATH_WIDGETS, widgets)
    return setIn(newState, PATH_LINKS, links)
  },
})

export const addToCurrentSelection = (nodeKey) => ({
  type: 'Add to current selection',
  payload: nodeKey,
  reducer: (state) => {
    let newState = state
    if (getWidgetByEditorKey(state, nodeKey)) {
      newState = setIn(newState, [...getWidgetPathByEditorKey(nodeKey), 'selected'], !getWidgetByEditorKey(state, nodeKey).selected)
    }
    if (getLinkByEditorKey(state, nodeKey)) {
      newState = setIn(newState, [...getLinkPathByEditorKey(nodeKey), 'selected'], !getLinkByEditorKey(state, nodeKey).selected)
    }
    if (find(linksSelector(newState), ((link) => link.path.find((point) => point.editorKey === nodeKey)))) {
      const link = find(linksSelector(newState), ((link) => link.path.find((point) => point.editorKey === nodeKey)))
      newState = setIn(
        newState,
        [...PATH_LINKS, link.editorKey, 'path'],
        link.path.map((point) => point.editorKey === nodeKey ? { ...point, selected: !point.selected } : point),
      )
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

export const setEditorRef = (ref) => ({
  type: 'Set editor ref',
  payload: { ref },
  notLogable: true,
  reducer: (state) => setIn(state, PATH_EDITOR_REF, ref),
})

export const onEditorMouseMove = (position) => ({
  type: 'Editor mouse move',
  payload: { position },
  notLogable: true,
  reducer: (state) => {
    let newState = setIn(state, PATH_CURSOR, position)
    if (draggingSelector(newState)) {
      const diff = computeDiff(cursorSelector(newState), cursorSelector(state))
      if (some(newState.editor.widgets, (w) => w.selected)) {
        const selectedKeys = map(filter(newState.editor.widgets, (w) => w.selected), (w) => w.editorKey)
        const newWidgets = selectedKeys.reduce(
          (acc, key) => {
            const movedWidget = update(newState.editor.widgets[key], {
              x: { $sum: diff.x / state.editor.canvas.zoom },
              y: { $sum: diff.y / state.editor.canvas.zoom },
            })
            return { ...acc, [key]: movedWidget }
          },
          {}
        )
        const links = reduce(
          newState.editor.links,
          (acc, value, key) => {
            const moveLast = selectedKeys.find((key) => {
              return some(newState.editor.widgets[key].outPorts, (port) => port.editorKey === value.destination) ||
                some(newState.editor.widgets[key].inPorts, (port) => port.editorKey === value.destination)
            })
            const moveFirst = selectedKeys.find((key) => {
              return some(newState.editor.widgets[key].inPorts, (port) => port.editorKey === value.source) ||
                some(newState.editor.widgets[key].outPorts, (port) => port.editorKey === value.source)
            })
            let newLink = value
            if (moveFirst) {
              newLink = { ...newLink, path: [{ ...newLink.path[0], x: newLink.path[0].x + diff.x / state.editor.canvas.zoom, y: newLink.path[0].y + diff.y / state.editor.canvas.zoom }, ...newLink.path.slice(1)] }
            }
            if (moveLast) {
              const last = newLink.path[newLink.path.length - 1]
              newLink = { ...newLink, path: [...newLink.path.slice(0, newLink.path.length - 1), { ...last, x: last.x + diff.x / state.editor.canvas.zoom, y: last.y + diff.y / state.editor.canvas.zoom }] }
            }
            return { ...acc, [key]: newLink }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, widgets: { ...newState.editor.widgets, ...newWidgets }, links } }
      }

      if (some(newState.editor.links, (link) => link.selected)) {
        const selectedKeys = map(filter(newState.editor.links, (link) => link.selected), (link) => link.editorKey)
        const newLinks = selectedKeys.reduce(
          (acc, key) => {
            const movedLink = update(newState.editor.links[key], {
              path: {
                $set: newState.editor.links[key].path.map((point, index) => {
                  if (index === 0 || index === newState.editor.links[key].path.length - 1) return point
                  return { ...point, x: point.x + diff.x / state.editor.canvas.zoom, y: point.y + diff.y / state.editor.canvas.zoom }
                }),
              },
            })
            return { ...acc, [key]: movedLink }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, links: { ...newState.editor.links, ...newLinks } } }
      }

      if (some(newState.editor.links, (link) => some(link.path, (point) => point.selected))) {
        const newLinks = reduce(
          newState.editor.links,
          (acc, link, key) => {
            return {
              ...acc,
              [key]: {
                ...link,
                path: link.path.map((point) => {
                  if (!selectedNodesSelector(state).includes(link.editorKey) && point.selected) return { ...point, x: point.x + diff.x / state.editor.canvas.zoom, y: point.y + diff.y / state.editor.canvas.zoom }
                  else return point
                }),
              },
            }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, links: newLinks } }
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

export const createDefaultLinkPoint = (position) => ({ ...position, editorKey: uniqueId(), selected: false })

export const onEditorMouseDown = (point) => (dispatch, getState) => {
  dispatch(setDragging(true))
  dispatch(cancelCurrentSelection())
}

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  reducer: (state) => setIn(state, PATH_DRAGGING, false),
})

export const updateZoom = (deltaY, deltaScale) => ({
  type: 'Update zoom',
  payload: { deltaY, deltaScale },
  reducer: (state) => setIn(state, PATH_ZOOM, Math.max(zoomSelector(state) + deltaY * deltaScale, 0)),
})


export const setSelectedPort = (editorKey, point) => ({
  type: 'Set selected port',
  payload: { editorKey, point },
  reducer: (state) => setIn(state, PATH_CURRENT_LINK, editorKey === -1 ?
    undefined :
    {
      source: editorKey,
      path: [],
      destination: undefined,
    }),
})

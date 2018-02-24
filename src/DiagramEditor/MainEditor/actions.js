import { PATH_EDITOR, PATH_MOUSE, PATH_CANVAS } from './state'
import { uniqueId, reduce, some, map, filter } from 'lodash'
import update from '../../utils/update'

const setDragging = (editorState, isDragging) => update(editorState, {
  mouse: {
    dragging: { $set: isDragging },
  },
})

const getRelativePoint = (editorRef, { x, y }) => {
  const boundingRect = editorRef.getBoundingClientRect()
  return { x: x - boundingRect.left, y: y - boundingRect.top }
}

const getRelativeMousePoint = (editorState, { x, y }) => {
  const boundingRect = editorState.editorRef.getBoundingClientRect()
  const zoom = editorState.canvas.zoom
  const offset = editorState.canvas.offset
  return {
    x: (x - boundingRect.left - boundingRect.width * (1 - zoom) / 2 - offset.x) / zoom,
    y: (y - boundingRect.top - boundingRect.height * (1 - zoom) / 2 - offset.y) / zoom,
  }
}

export const addWidget = (command, pos) => ({
  type: 'Add widget to editor',
  path: [...PATH_EDITOR],
  payload: { command, pos },
  reducer: (state) => {
    const id = uniqueId()
    const adjustedPos = getRelativeMousePoint(state, pos)
    return {
      ...state, widgets: {
        ...state.widgets,
        [id]: { ...command, ...adjustedPos, editorKey: id, selected: false },
      },
    }
  },
})


export const setSelectedWidget = (widgetKey, onlyAppend) => ({
  type: 'Add to selected widgets',
  path: [...PATH_EDITOR],
  payload: { widgetKey, onlyAppend },
  reducer: (state) => {
    let widgetsState = state.widgets
    if (!onlyAppend) {
      widgetsState = reduce(
        widgetsState,
        (acc, value, key) => ({ ...acc, [key]: { ...value, selected: false } }),
        {}
      )
    }
    if (widgetKey) {
      widgetsState = update(widgetsState, {
        [widgetKey]: {
          selected: {
            $apply: (selected) => !selected,
          },
        },
      })
    }
    return { ...setDragging(state, true), widgets: widgetsState }
  },
})

export const setEditorRef = (ref) => ({
  type: 'Set editor ref',
  path: [...PATH_EDITOR, 'editorRef'],
  payload: { ref },
  reducer: (state) => ref,
})

export const onEditorMouseMove = (position) => ({
  type: 'Editor mouse move',
  path: [...PATH_EDITOR],
  payload: { position },
  reducer: (state) => {
    let newState = update(state, {
      mouse: {
        cursor: { $set: getRelativePoint(state.editorRef, position) },
      },
    })
    console.log(getRelativePoint(state.editorRef, position))
    if (newState.mouse.dragging) {
      const diffX = newState.mouse.cursor.x - state.mouse.cursor.x
      const diffY = newState.mouse.cursor.y - state.mouse.cursor.y
      console.log(diffX, diffY)
      if (some(newState.widgets, (w) => w.selected)) {
        const selectedKeys = map(filter(newState.widgets, (w) => w.selected), (w) => w.editorKey)
        const newWidgets = selectedKeys.reduce(
          (acc, key) => {
            const movedWidget = update(newState.widgets[key], {
              x: { $sum: diffX / state.canvas.zoom },
              y: { $sum: diffY / state.canvas.zoom },
            })
            return { ...acc, [key]: movedWidget }
          },
          {}
        )
        newState = { ...newState, widgets: { ...newState.widgets, ...newWidgets } }
      } else {
        newState = update(newState, {
          canvas: {
            offset: {
              x: { $sum: diffX },
              y: { $sum: diffY },
            },
          },
        })
      }
    }
    return newState
  },
  notLogable: true,
})

export const onEditorMouseDown = () => ({
  type: 'Editor mouse down',
  path: [...PATH_EDITOR],
  payload: undefined,
  reducer: (state) => {
    return setSelectedWidget(undefined).reducer(state)
  },
})

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  path: [...PATH_MOUSE, 'dragging'],
  payload: undefined,
  reducer: (state) => false,
})

export const updateZoom = (deltaY, deltaScale) => ({
  type: 'Update zoom',
  path: [...PATH_CANVAS, 'zoom'],
  payload: { deltaY, deltaScale },
  reducer: (zoom) => Math.max(zoom + deltaY * deltaScale, 0),
})

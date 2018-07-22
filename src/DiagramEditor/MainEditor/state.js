import { createSelector } from 'reselect'
import { forEach, get } from 'lodash'
import { relativeMousePoint } from './actions'

export const PATH_EDITOR = ['editor']
export const PATH_MOUSE = [...PATH_EDITOR, 'mouse']
export const PATH_CANVAS = [...PATH_EDITOR, 'canvas']
export const PATH_WIDGETS = [...PATH_EDITOR, 'widgets']
export const PATH_CURRENT_LINK = [...PATH_EDITOR, 'currentLink']
export const PATH_LINKS = [...PATH_EDITOR, 'links']
export const PATH_EDITOR_REF = [...PATH_EDITOR, 'editorRef']
export const PATH_DRAGGING = [...PATH_MOUSE, 'dragging']
export const PATH_CURSOR = [...PATH_MOUSE, 'cursor']
export const PATH_CURRENT_LINK_POINTS = [...PATH_CURRENT_LINK, 'path']
export const PATH_ZOOM = [...PATH_CANVAS, 'zoom']
export const PATH_OFFSET = [...PATH_CANVAS, 'offset']
export const getWidgetPathByEditorKey = (editorKey) => [...PATH_WIDGETS, editorKey]
export const getLinkPathByEditorKey = (editorKey) => [...PATH_LINKS, editorKey]

export const setInitialState = (state) => ({
  ...state,
  [PATH_EDITOR]: {
    mouse: {
      cursor: undefined,
      dragging: false,
    },
    canvas: {
      offset: {
        x: 0,
        y: 0,
      },
      zoom: 1,
    },
    widgets: {},
    links: {},
    currentLink: undefined,
    editorRef: undefined,
  },
})

export const widgetsSelector = (state) => get(state, PATH_WIDGETS)
export const editorRefSelector = (state) => get(state, PATH_EDITOR_REF)
export const cursorSelector = (state) => get(state, PATH_CURSOR)
export const draggingSelector = (state) => get(state, PATH_DRAGGING)
export const zoomSelector = (state) => get(state, PATH_ZOOM)
export const offsetSelector = (state) => get(state, PATH_OFFSET)
export const currentLinkSelector = (state) => get(state, PATH_CURRENT_LINK)
export const linksSelector = (state) => get(state, PATH_LINKS)
export const currentLinkPointsSelector = (state) => get(state, PATH_CURRENT_LINK_POINTS)

export const getWidgetByEditorKey = (state, editorKey) =>
  get(state, getWidgetPathByEditorKey(editorKey))
export const getLinkByEditorKey = (state, editorKey) =>
  get(state, getLinkPathByEditorKey(editorKey))

export const selectedNodesSelector = createSelector(
  widgetsSelector,
  linksSelector,
  (widgets, links) => {
    const selected = []
    forEach({ ...widgets, ...links }, (node) => {
      if (node.selected) selected.push(node.editorKey)
    })
    forEach(links, (link) => {
      forEach(link.path, (node) => {
        if (node.selected) selected.push(node.editorKey)
      })
    })
    return selected
  }
)

export const relativeCursorPointSelector = (state) => {
  return cursorSelector(state) && relativeMousePoint(state, cursorSelector(state))
}

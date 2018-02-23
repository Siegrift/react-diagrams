import { setIn, getIn } from '../../utils/helpers'

export const PATH_EDITOR = ['editor']
export const PATH_MOUSE = [...PATH_EDITOR, 'mouse']
export const PATH_CANVAS = [...PATH_EDITOR, 'canvas']
export const PATH_WIDGETS = [...PATH_EDITOR, 'widgets']

export const setInitialState = (state) =>
  setIn(state, PATH_EDITOR, {
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
    editorRef: undefined,
  }, true)

export const widgetsSelector = (state) => getIn(state, [...PATH_WIDGETS])
export const editorRefSelector = (state) => getIn(state, [...PATH_EDITOR, 'editorRef'])
export const cursorSelector = (state) => getIn(state, [...PATH_MOUSE, 'cursor'])
export const draggingSelector = (state) => getIn(state, [...PATH_MOUSE, 'dragging'])
export const zoomSelector = (state) => getIn(state, [...PATH_CANVAS, 'zoom'])
export const offsetSelector = (state) => getIn(state, [...PATH_CANVAS, 'offset'])

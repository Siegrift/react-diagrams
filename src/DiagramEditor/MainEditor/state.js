// @flow
import type { StateDraft } from '../../initialState'

export const PATH_EDITOR = ['editor']
export const PATH_MOUSE = [...PATH_EDITOR, 'mouse']
export const PATH_CANVAS = [...PATH_EDITOR, 'canvas']
export const PATH_EDITOR_REF = [...PATH_EDITOR, 'editorRef']
export const PATH_DRAGGING = [...PATH_MOUSE, 'dragging']
export const PATH_CURSOR = [...PATH_MOUSE, 'cursor']
export const PATH_ZOOM = [...PATH_CANVAS, 'zoom']
export const PATH_OFFSET = [...PATH_CANVAS, 'offset']

export type EditorState = {
  mouse: {
    cursor: {
      x: number,
      y: number,
    },
    dragging: boolean,
  },
  canvas: {
    offset: {
      x: number,
      y: number,
    },
    zoom: number,
  },
  // TODO: TBD
  editorRef: any,
}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedEditorState = { editor: EditorState }

export const setInitialState = (state: StateDraft): StateDraft & AppliedEditorState => ({
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
    editorRef: undefined,
  },
})

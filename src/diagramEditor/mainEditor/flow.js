// @flow
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
  editorBounds: any,
}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedEditorState = { editor: EditorState }

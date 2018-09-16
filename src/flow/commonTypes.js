// @flow
export type PathElement = number | string
export type Path = Array<PathElement>

export type Dimension = {
  width: number,
  height: number,
}

export type Position = {
  x: number,
  y: number,
}

export type EditorKey = string
export type Node = {
  selected: boolean,
  editorKey: EditorKey,
}

export type BoundingBox = {
  x: number,
  y: number,
  width: number,
  height: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
}

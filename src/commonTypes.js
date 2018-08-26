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

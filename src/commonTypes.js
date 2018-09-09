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

// dagre (formatter) uses center positioning
export type Center = Position

export type EditorKey = string

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

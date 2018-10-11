// @flow
import type { EditorKey, Position, Node } from '../../../flow/commonTypes'

export type Widget = {
  key: string,
  inPortKeys: EditorKey[],
  outPortKeys: EditorKey[],
} & Position &
  Node
export type WidgetState = { [key: EditorKey]: Widget }
export type AppliedWidgetState = { widgets: WidgetState }

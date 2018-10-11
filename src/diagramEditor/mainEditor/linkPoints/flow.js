// @flow
import type { EditorKey, Position, Node } from '../../../flow/commonTypes'

export type LinkPoint = Position &
  Node & {
    visible: boolean,
  }

export type LinkPointsState = { [key: EditorKey]: LinkPoint }

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedLinkPointsState = { linkPoints: LinkPointsState }

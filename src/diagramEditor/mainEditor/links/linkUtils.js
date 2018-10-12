// @flow
import type { Position, EditorKey } from '../../../flow/commonTypes'
import type { State } from '../../../flow/reduxTypes'
import { portByEditorKeySelector } from '../ports/selectors'

/** Returns the distance from p1 to p3 + p2 to p3. */
export const distance = (p1: Position, p2: Position, p3: Position): number => {
  return (
    Math.abs(p1.x - p3.x) + Math.abs(p1.y - p3.y) + Math.abs(p2.x - p3.x) + Math.abs(p2.y - p3.y)
  )
}

export const isInvalidLink = (
  state: State,
  sourceEditorKey: EditorKey,
  targetEditorKey: EditorKey
) => {
  const sourcePort = portByEditorKeySelector(state, sourceEditorKey)
  const targetPort = portByEditorKeySelector(state, targetEditorKey)
  return sourcePort.isInPort || !targetPort.isInPort
}

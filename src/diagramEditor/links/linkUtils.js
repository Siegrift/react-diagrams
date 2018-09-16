// @flow
import type { Position, EditorKey } from '../../flow/commonTypes'
import type { State } from '../../flow/reduxTypes'
import { getWidgetByEditorKey } from '../widgets/selectors'
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
  targetEditorKey: EditorKey,
  linkChecker: Function
) => {
  const sourcePort = portByEditorKeySelector(state, sourceEditorKey)
  const sourceWidget = getWidgetByEditorKey(state, sourcePort.widgetEditorKey)
  const targetPort = portByEditorKeySelector(state, targetEditorKey)
  const targetWidget = getWidgetByEditorKey(state, targetPort.widgetEditorKey)
  return !linkChecker(sourcePort, sourceWidget, targetPort, targetWidget)
}

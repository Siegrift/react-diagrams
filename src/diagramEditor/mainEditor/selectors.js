// @flow
import { get, forEach } from 'lodash'
import { createSelector } from 'reselect'
import { PATH_EDITOR_BOUNDS, PATH_CURSOR, PATH_ZOOM, PATH_OFFSET, PATH_DRAGGING } from './state'
import { linksSelector } from '../links/selectors'
import { widgetsSelector } from '../widgets/selectors'
import { linkPointsSelector } from '../linkPoints/selectors'

import type { State } from '../../flow/reduxTypes'
import type { Node, Position } from '../../flow/commonTypes'
import type { WidgetState } from '../widgets/state'
import type { LinkState } from '../links/state'
import type { LinkPointsState } from '../linkPoints/state'

export const editorBoundsSelector = (state: State) => get(state, PATH_EDITOR_BOUNDS)
export const cursorSelector = (state: State) => get(state, PATH_CURSOR)
export const draggingSelector = (state: State) => get(state, PATH_DRAGGING)
export const zoomSelector = (state: State) => get(state, PATH_ZOOM)
export const offsetSelector = (state: State) => get(state, PATH_OFFSET)

export const selectedNodesSelector = createSelector(
  widgetsSelector,
  linksSelector,
  linkPointsSelector,
  (widgets: WidgetState, links: LinkState, linkPoints: LinkPointsState) => {
    const selected = []
    forEach({ ...widgets, ...links, ...linkPoints }, (node: Node) => {
      if (node.selected) selected.push(node.editorKey)
    })
    return selected
  }
)

// TODO: make a selector
export const relativeMousePoint = (state: State, { x, y }: Position) => {
  const boundingRect = editorBoundsSelector(state)
  const zoom = zoomSelector(state),
    offset = offsetSelector(state)
  return {
    x: (x - boundingRect.left - (boundingRect.width * (1 - zoom)) / 2 - offset.x) / zoom,
    y: (y - boundingRect.top - (boundingRect.height * (1 - zoom)) / 2 - offset.y) / zoom,
  }
}

export const relativeCursorPointSelector = (state: State) => {
  return cursorSelector(state) && relativeMousePoint(state, cursorSelector(state))
}

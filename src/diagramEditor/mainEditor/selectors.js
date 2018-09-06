import { get, forEach } from 'lodash'
import { createSelector } from 'reselect'
import { PATH_EDITOR_REF, PATH_CURSOR, PATH_ZOOM, PATH_OFFSET, PATH_DRAGGING } from './state'
import { linksSelector } from '../links/selectors'
import { widgetsSelector } from '../widgets/selectors'
import { linkPointsSelector } from '../linkPoints/selectors'

export const editorRefSelector = (state) => get(state, PATH_EDITOR_REF)
export const cursorSelector = (state) => get(state, PATH_CURSOR)
export const draggingSelector = (state) => get(state, PATH_DRAGGING)
export const zoomSelector = (state) => get(state, PATH_ZOOM)
export const offsetSelector = (state) => get(state, PATH_OFFSET)

export const selectedNodesSelector = createSelector(
  widgetsSelector,
  linksSelector,
  linkPointsSelector,
  (widgets, links, linkPoints) => {
    const selected = []
    forEach({ ...widgets, ...links, ...linkPoints }, (node) => {
      if (node.selected) selected.push(node.editorKey)
    })
    return selected
  }
)

// TODO: make a selector
export const relativeMousePoint = (state, { x, y }) => {
  const boundingRect = editorRefSelector(state).getBoundingClientRect()
  const zoom = zoomSelector(state),
    offset = offsetSelector(state)
  return {
    x: (x - boundingRect.left - (boundingRect.width * (1 - zoom)) / 2 - offset.x) / zoom,
    y: (y - boundingRect.top - (boundingRect.height * (1 - zoom)) / 2 - offset.y) / zoom,
  }
}

export const relativeCursorPointSelector = (state) => {
  return cursorSelector(state) && relativeMousePoint(state, cursorSelector(state))
}

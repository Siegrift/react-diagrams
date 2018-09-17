// @flow
import { map, omit, reduce } from 'lodash'
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import {
  linkPointsToMoveSelector,
  linkPointsToDeleteSelector,
  linkPointsSelector,
} from './selectors'
import { mergeIn, multiSetIn } from '../../imuty'
import { PATH_LINK_POINTS } from './state'
import { PATH_LINKS } from '../links/state'
import { linksSelector } from '../links/selectors'

import type { Link } from '../links/state'
import type { EditorKey, Position } from '../../flow/commonTypes'
import type { Dispatch, GenericAction, State } from '../../flow/reduxTypes'
import type { LinkPoint } from './state'

export const onPointMouseDown = (event: MouseEvent, editorKey: EditorKey) => (
  dispatch: Dispatch
) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, event.ctrlKey))
}

export const moveSelectedLinkPoints = (diff: Position): GenericAction<Position> => ({
  type: 'Move selected link points',
  payload: diff,
  loggable: false,
  undoable: false,
  reducer: (state: State) => {
    const toMove = linkPointsToMoveSelector(state)
    return mergeIn(
      state,
      PATH_LINK_POINTS,
      toMove.reduce(
        (acc: Object, linkPoint: LinkPoint) => ({
          ...acc,
          [linkPoint.editorKey]: {
            ...linkPoint,
            x: linkPoint.x + diff.x,
            y: linkPoint.y + diff.y,
          },
        }),
        {}
      )
    )
  },
})

// removes current link points from current selection
export const removeLinkPoints = () => ({
  type: 'Remove selected link points',
  undoable: false,
  loggable: false,
  reducer: (state: State) => {
    const toRemove = map(
      linkPointsToDeleteSelector(state),
      (linkPoint: LinkPoint) => linkPoint.editorKey
    )
    const toRemoveSet = new Set(toRemove)
    const linkState = reduce(
      linksSelector(state),
      (acc: Object, link: Link) => ({
        ...acc,
        [link.editorKey]: {
          ...link,
          path: link.path.filter((key: EditorKey) => !toRemoveSet.has(key)),
        },
      }),
      {}
    )
    return multiSetIn(
      state,
      [PATH_LINK_POINTS, omit(linkPointsSelector(state), toRemove)],
      [PATH_LINKS, linkState]
    )
  },
})

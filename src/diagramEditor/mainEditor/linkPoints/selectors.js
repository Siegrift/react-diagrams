// @flow
import { get, map, filter, concat, pick, flatten } from 'lodash'
import { PATH_LINK_POINTS } from './state'
import { createSelector } from 'reselect'
import { selectedPortsSelector } from '../widgets/selectors'
import { linksSelector, selectedLinksSelector, linksToDeleteSelector } from '../links/selectors'

import type { State } from '../../../flow/reduxTypes'
import type { EditorKey } from '../../../flow/commonTypes'
import type { LinkPointsState, LinkPoint } from './flow'
import type { LinkState, Link } from '../links/flow'

export const linkPointsSelector = (state: State) => get(state, PATH_LINK_POINTS)
export const linkPointByEditorKeySelector = (editorKey: EditorKey) =>
  createSelector(linkPointsSelector, (linkPoints: LinkPointsState) => linkPoints[editorKey])
export const linkPointsByEditorKeysSelector = (editorKeys: EditorKey[]) =>
  createSelector(linkPointsSelector, (linkPoints: LinkPointsState) =>
    editorKeys.map((key: EditorKey) => linkPoints[key])
  )

export const linkPointsToMoveSelector = createSelector(
  linkPointsSelector,
  linksSelector,
  selectedLinksSelector,
  selectedPortsSelector,
  (linkPoints: LinkPointsState, links: LinkState, linksToMove: LinkState, ports: EditorKey[]) => {
    const movedPorts = new Set(ports)
    // move link points of links, that have source or target in dragged widgets
    const pointsToMove = map(links, (link: Link) =>
      concat(
        movedPorts.has(link.source) ? [link.path[0]] : [],
        movedPorts.has(link.target) ? [link.path[link.path.length - 1]] : []
      )
    )
    const movedByLinks = new Set(flatten(map(linksToMove, (link: Link) => link.path)))

    return Object.values({
      // take selected link points unless the link itself is selected
      // (this prevents the point being moved twice)
      ...filter(linkPoints, (linkPoint: LinkPoint) => {
        return linkPoint.selected && !movedByLinks.has(linkPoint.editorKey)
      }),
      ...pick(linkPoints, ...pointsToMove),
    })
  }
)

export const linkPointsToDeleteSelector = createSelector(
  linkPointsSelector,
  linksToDeleteSelector,
  (linkPoints: LinkPointsState, links: LinkState) => {
    const linkPointPath = new Set(flatten(map(links, (link: Link) => link.path)))
    return filter(
      linkPoints,
      (linkPoint: LinkPoint) => linkPoint.selected || linkPointPath.has(linkPoint.editorKey)
    )
  }
)

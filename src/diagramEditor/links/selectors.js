// @flow
import { get, filter, difference, map } from 'lodash'
import { createSelector } from 'reselect'
import {
  PATH_CURRENT_LINK,
  PATH_CURRENT_LINK_POINTS,
  PATH_LINKS,
  getLinkPathByEditorKey,
} from './state'
import { selectedPortsSelector } from '../widgets/selectors'

import type { EditorKey } from '../../flow/commonTypes'
import type { State } from '../../flow/reduxTypes'
import type { LinkState, Link } from './state'
import type { LinkPointsState, LinkPoint } from '../linkPoints/state'

export const currentLinkSelector = (state: State) => get(state, PATH_CURRENT_LINK)
export const linksSelector = (state: State) => get(state, PATH_LINKS)
export const currentLinkPointsSelector = (state: State) => get(state, PATH_CURRENT_LINK_POINTS)

export const getLinkByEditorKey = (state: State, editorKey: EditorKey) =>
  get(state, getLinkPathByEditorKey(editorKey))

export const selectedLinksSelector = createSelector(linksSelector, (links: LinkState) =>
  filter(links, (link: Link) => link.selected)
)

// TODO: this should be in a ../links/selectors file, but that would cause transitive dep issue
export const rawSelectedLinkPointsSelector = createSelector(
  // TODO: we can't import the path as well
  (state: State) => get(state, ['linkPoints']),
  (linkPoints: LinkPointsState) => filter(linkPoints, (linkPoint: LinkPoint) => linkPoint.selected)
)

export const linksToDeleteSelector = createSelector(
  linksSelector,
  selectedPortsSelector,
  rawSelectedLinkPointsSelector,
  (links: LinkState, ports: EditorKey[], linkPoints: LinkPointsState) => {
    const portSet = new Set(ports)
    const linkPointKeys = map(linkPoints, (linkPoint: LinkPoint) => linkPoint.editorKey)
    return filter(links, (link: Link) => {
      // if there are only source and target left, remove the whole link
      const linkPathLeft = difference(link.path, linkPointKeys)
      return (
        link.selected ||
        portSet.has(link.source) ||
        portSet.has(link.target) ||
        linkPathLeft.length === 2
      )
    })
  }
)

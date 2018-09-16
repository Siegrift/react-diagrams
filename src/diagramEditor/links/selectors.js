// @flow
import { get, filter } from 'lodash'
import {
  PATH_CURRENT_LINK,
  PATH_CURRENT_LINK_POINTS,
  PATH_LINKS,
  getLinkPathByEditorKey,
} from './state'
import { createSelector } from 'reselect'

import type { EditorKey } from '../../flow/commonTypes'
import type { State } from '../../flow/reduxTypes'
import type { LinkState, Link } from './state'

export const currentLinkSelector = (state: State) => get(state, PATH_CURRENT_LINK)
export const linksSelector = (state: State) => get(state, PATH_LINKS)
export const currentLinkPointsSelector = (state: State) => get(state, PATH_CURRENT_LINK_POINTS)

export const getLinkByEditorKey = (state: State, editorKey: EditorKey) =>
  get(state, getLinkPathByEditorKey(editorKey))

export const linksToMoveSelector = createSelector(linksSelector, (links: LinkState) =>
  filter(links, (link: Link) => link.selected)
)

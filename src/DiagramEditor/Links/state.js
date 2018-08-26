// @flow
import type { StateDraft } from '../../initialState'

import type { EditorKey, Path } from '../../commonTypes'

export const PATH_LINKS = ['links']
export const PATH_CURRENT_LINK = [...PATH_LINKS, 'currentLink']
export const PATH_CURRENT_LINK_POINTS = [...PATH_CURRENT_LINK, 'path']
export const getLinkPathByEditorKey = (editorKey: EditorKey): Path => [...PATH_LINKS, editorKey]

// FLOW: TBD
export type Link = {}

// FLOW: TBD
export type LinkState = {}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedLinkState = { links: LinkState }

export const setInitialState = (state: StateDraft): StateDraft & LinkState => ({
  ...state,
  [PATH_LINKS.toString()]: {},
  [PATH_CURRENT_LINK.toString()]: undefined,
})
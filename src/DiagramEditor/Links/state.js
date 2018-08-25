// @flow
import type { StateDraft } from '../../initialState'

export const PATH_LINKS = ['links']
export const PATH_CURRENT_LINK = [...PATH_LINKS, 'currentLink']
export const PATH_CURRENT_LINK_POINTS = [...PATH_CURRENT_LINK, 'path']
export const getLinkPathByEditorKey = (editorKey) => [...PATH_LINKS, editorKey]

// TODO: TBD
export type LinkState = {}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedLinkState = { links: LinkState }

export const setInitialState = (state: StateDraft): StateDraft & LinkState => ({
  ...state,
  [PATH_LINKS]: {},
  [PATH_CURRENT_LINK]: undefined,
})

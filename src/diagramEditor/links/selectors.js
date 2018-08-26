import { get } from 'lodash'
import {
  PATH_CURRENT_LINK,
  PATH_CURRENT_LINK_POINTS,
  PATH_LINKS,
  getLinkPathByEditorKey,
} from './state'

export const currentLinkSelector = (state) => get(state, PATH_CURRENT_LINK)
export const linksSelector = (state) => get(state, PATH_LINKS)
export const currentLinkPointsSelector = (state) => get(state, PATH_CURRENT_LINK_POINTS)

// TODO: make a selector
export const getLinkByEditorKey = (state, editorKey) =>
  get(state, getLinkPathByEditorKey(editorKey))

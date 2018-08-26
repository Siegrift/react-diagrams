// @flow
import { get } from 'lodash'
import {
  PATH_CURRENT_LINK,
  PATH_CURRENT_LINK_POINTS,
  PATH_LINKS,
  getLinkPathByEditorKey,
} from './state'

import type { EditorKey } from '../../commonTypes'
import type { State } from '../../reduxTypes'

export const currentLinkSelector = (state: State) => get(state, PATH_CURRENT_LINK)
export const linksSelector = (state: State) => get(state, PATH_LINKS)
export const currentLinkPointsSelector = (state: State) => get(state, PATH_CURRENT_LINK_POINTS)

// TODO: make a selector
export const getLinkByEditorKey = (state: State, editorKey: EditorKey) =>
  get(state, getLinkPathByEditorKey(editorKey))

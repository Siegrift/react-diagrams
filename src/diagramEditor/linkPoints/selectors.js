// @flow
import { get } from 'lodash'
import { PATH_LINK_POINTS } from './state'
import { createSelector } from 'reselect'

import type { State } from '../../flow/reduxTypes'
import type { EditorKey } from '../../flow/commonTypes'
import type { LinkPointsState } from './state'

export const linkPointsSelector = (state: State) => get(state, PATH_LINK_POINTS)
export const linkPointByEditorKeySelector = (editorKey: EditorKey) =>
  createSelector(linkPointsSelector, (linkPoints: LinkPointsState) => linkPoints[editorKey])
export const linkPointsByEditorKeys = (editorKeys: EditorKey[]) =>
  createSelector(linkPointsSelector, (linkPoints: LinkPointsState) =>
    editorKeys.map((key: EditorKey) => linkPoints[key])
  )

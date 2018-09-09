// @flow
import { get } from 'lodash'
import { PATH_PORTS } from './state'

import type { State } from '../../flow/reduxTypes'
import type { EditorKey } from '../../flow/commonTypes'

export const portsSelector = (state: State) => get(state, PATH_PORTS)
export const portByEditorKeySelector = (state: State, editorKey: EditorKey) =>
  get(state, [...PATH_PORTS, editorKey])

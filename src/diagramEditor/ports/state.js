// @flow
import type { StateDraft } from '../../initialState'

import type { EditorKey } from '../../commonTypes'
import type { Port as SchemaPort } from '../../schemaTypes'

export const PATH_PORTS = ['ports']

export type Port = SchemaPort & {
  editorKey: EditorKey,
  widgetEditorKey: EditorKey,
  isInPort: boolean,
}

// FLOW: TBD, key is actually editorKey
export type PortState = { [key: EditorKey]: any }

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedPortState = {
  ports: PortState,
}

export const setInitialState = (state: StateDraft): StateDraft & AppliedPortState => ({
  ...state,
  [PATH_PORTS.toString()]: {},
})

// @flow
import type { EditorKey } from '../../../flow/commonTypes'
import type { Port as SchemaPort } from '../../../flow/schemaTypes'
export type Port = SchemaPort & {
  editorKey: EditorKey,
  widgetEditorKey: EditorKey,
  isInPort: boolean,
}

export type PortState = { [key: EditorKey]: Port }

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedPortState = {
  ports: PortState,
}

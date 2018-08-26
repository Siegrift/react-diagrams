// @flow
import { uniqueId } from 'lodash'

import type { Port as SchemaPort } from '../../schemaTypes'
import type { Port } from './state'
import type { EditorKey } from '../../commonTypes'

export type CreatedPorts = {
  inPorts: Port[],
  outPorts: Port[],
}

export const createPorts = (
  { inPorts, outPorts }: { inPorts: SchemaPort[], outPorts: SchemaPort[] },
  widgetEditorKey: EditorKey
): CreatedPorts => {
  return {
    inPorts: inPorts.map((port: SchemaPort) => ({
      ...port,
      editorKey: uniqueId(),
      isInPort: true,
      widgetEditorKey,
    })),
    outPorts: outPorts.map((port: SchemaPort) => ({
      ...port,
      editorKey: uniqueId(),
      isInPort: false,
      widgetEditorKey,
    })),
  }
}

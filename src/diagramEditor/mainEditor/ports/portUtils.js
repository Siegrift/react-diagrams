// @flow
import { uniqueId } from 'lodash'

import type { Port as SchemaPort } from '../../../flow/schemaTypes'
import type { Port } from './flow'
import type { Widget } from '../widgets/flow'
import type { EditorKey } from '../../../flow/commonTypes'

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

export const isValidLinkDefault = (
  sourcePort: Port,
  sourceWidget: Widget,
  targetPort: Port,
  targetWidget: Widget
) => {
  return !sourcePort.isInPort && targetPort.isInPort
}

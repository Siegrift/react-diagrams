import { uniqueId } from 'lodash'

export const createPorts = ({ inPorts, outPorts }, widgetEditorKey) => {
  return {
    inPorts: inPorts.map((port) => ({ ...port, editorKey: uniqueId(), widgetEditorKey })),
    outPorts: outPorts.map((port) => ({ ...port, editorKey: uniqueId(), widgetEditorKey })),
  }
}

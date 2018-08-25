import { uniqueId } from 'lodash'

export const createPorts = ({ inPorts, outPorts }) => {
  return {
    inPorts: inPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
    outPorts: outPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
  }
}

import { get } from 'lodash'
import { PATH_PORTS } from './state'

export const getPorts = (state) => get(state, PATH_PORTS)
export const portByEditorKeySelector = (state, editorKey) => get(state, [...PATH_PORTS, editorKey])

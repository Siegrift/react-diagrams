import { setInitialState as appInitialState } from './DiagramEditor/state.js'
import { setInitialState as editorInitialState } from './DiagramEditor/MainEditor/state'
import { compose } from './utils/helpers'

const state = {}

export default () => compose(
  appInitialState,
  editorInitialState,
)(state)

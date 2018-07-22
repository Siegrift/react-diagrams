import { compose } from 'recompose'
import { setInitialState as appInitialState } from './DiagramEditor/state.js'
import { setInitialState as editorInitialState } from './DiagramEditor/MainEditor/state'

const state = {}

export default () =>
  compose(
    appInitialState,
    editorInitialState
  )(state)

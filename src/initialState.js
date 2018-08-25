import { compose } from 'recompose'
import { setInitialState as appInitialState } from './DiagramEditor/state.js'
import { setInitialState as editorInitialState } from './DiagramEditor/MainEditor/state'
import { setInitialState as widgetsInitialState } from './DiagramEditor/Widgets/state'
import { setInitialState as linksInitialState } from './DiagramEditor/Links/state'
import { setInitialState as portInitialState } from './DiagramEditor/Ports/state'

const state = {}

export default () =>
  compose(
    appInitialState,
    editorInitialState,
    widgetsInitialState,
    linksInitialState,
    portInitialState
  )(state)

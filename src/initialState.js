// @flow
import { compose } from './utils'
import { setInitialState as appInitialState } from './diagramEditor/state'
import { setInitialState as editorInitialState } from './diagramEditor/mainEditor/state'
import { setInitialState as widgetsInitialState } from './diagramEditor/mainEditor/widgets/state'
import { setInitialState as linksInitialState } from './diagramEditor/mainEditor/links/state'
import { setInitialState as portInitialState } from './diagramEditor/mainEditor/ports/state'
import { setInitialState as linkPointsInitialState } from './diagramEditor/mainEditor/linkPoints/state'

import type { State } from './flow/reduxTypes'

export default (): State =>
  compose(
    appInitialState,
    editorInitialState,
    widgetsInitialState,
    linksInitialState,
    portInitialState,
    linkPointsInitialState
  )({})

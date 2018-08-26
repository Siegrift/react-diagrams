// @flow
import { compose } from 'recompose'
import { setInitialState as appInitialState } from './DiagramEditor/state'
import { setInitialState as editorInitialState } from './DiagramEditor/MainEditor/state'
import { setInitialState as widgetsInitialState } from './DiagramEditor/Widgets/state'
import { setInitialState as linksInitialState } from './DiagramEditor/Links/state'
import { setInitialState as portInitialState } from './DiagramEditor/Ports/state'

import type { AppliedAppState } from './DiagramEditor/state'
import type { AppliedEditorState } from './DiagramEditor/MainEditor/state'
import type { AppliedWidgetState } from './DiagramEditor/Widgets/state'
import type { AppliedLinkState } from './DiagramEditor/Links/state'
import type { AppliedPortState } from './DiagramEditor/Ports/state'

export type State = AppliedAppState

export type StateDraft = ?AppliedAppState &
  ?AppliedEditorState &
  ?AppliedWidgetState &
  ?AppliedLinkState &
  ?AppliedPortState

export default (): State =>
  compose(
    appInitialState,
    editorInitialState,
    widgetsInitialState,
    linksInitialState,
    portInitialState
  )({})

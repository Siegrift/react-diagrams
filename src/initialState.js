// @flow
import { compose } from './utils'
import { setInitialState as appInitialState } from './diagramEditor/state'
import { setInitialState as editorInitialState } from './diagramEditor/mainEditor/state'
import { setInitialState as widgetsInitialState } from './diagramEditor/widgets/state'
import { setInitialState as linksInitialState } from './diagramEditor/links/state'
import { setInitialState as portInitialState } from './diagramEditor/ports/state'
import { setInitialState as linkPointsInitialState } from './diagramEditor/linkPoints/state'

import type { AppliedAppState } from './diagramEditor/state'
import type { AppliedEditorState } from './diagramEditor/mainEditor/state'
import type { AppliedWidgetState } from './diagramEditor/widgets/state'
import type { AppliedLinkState } from './diagramEditor/links/state'
import type { AppliedPortState } from './diagramEditor/ports/state'
import type { AppliedLinkPointsState } from './diagramEditor/linkPoints/state'

export type InitialState = AppliedAppState &
  AppliedEditorState &
  AppliedWidgetState &
  AppliedLinkState &
  AppliedPortState &
  AppliedLinkPointsState

export type StateDraft = ?AppliedAppState &
  ?AppliedEditorState &
  ?AppliedWidgetState &
  ?AppliedLinkState &
  ?AppliedPortState &
  ?AppliedLinkPointsState

export default (): InitialState =>
  compose(
    appInitialState,
    editorInitialState,
    widgetsInitialState,
    linksInitialState,
    portInitialState,
    linkPointsInitialState
  )({})

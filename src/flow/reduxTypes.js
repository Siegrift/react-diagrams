// @flow
import type { AppliedAppState } from '../diagramEditor/flow'
import type { AppliedEditorState } from '../diagramEditor/mainEditor/flow'
import type { AppliedWidgetState } from '../diagramEditor/mainEditor/widgets/flow'
import type { AppliedLinkState } from '../diagramEditor/mainEditor/links/flow'
import type { AppliedPortState } from '../diagramEditor/mainEditor/ports/flow'
import type { AppliedLinkPointsState } from '../diagramEditor/mainEditor/linkPoints/flow'

export type State = AppliedAppState &
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

export type SegmentReducer<Segment, Payload> = (state: Segment, payload: Payload) => Segment
export type GenericAction<Payload> = {
  type: string,
  payload?: Payload,
  reducer: SegmentReducer<State, Payload>,
  undoable?: boolean,
  loggable?: boolean,
}

export type Dispatch = (action: GenericAction<*> | Function) => null
export type GetState = () => State
export type Logger = { log: (message: string, payload?: Object) => null }
export type MiddlewareProps = {
  +dispatch: Dispatch,
  +getState: GetState,
}

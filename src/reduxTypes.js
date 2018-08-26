// @flow
import type { Path } from './commonTypes'
import type { InitialState } from './initialState'

// re-export State as it's imported mainly in redux actions
export type State = InitialState

export type SegmentReducer<Segment, Payload> = (state: Segment, payload: Payload) => Segment
export type GenericAction<Segment, Payload> = {
  type: string,
  path: Path | ((s: State) => Path),
  payload: Payload,
  reducer: SegmentReducer<Segment, Payload>,
  undoable?: boolean,
}

export type Dispatch = (action: GenericAction<*, *>) => null
export type GetState = () => State
export type Thunk = (dispatch: Dispatch, getState: any) => Promise<void>

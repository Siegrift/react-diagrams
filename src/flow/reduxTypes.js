// @flow
import type { InitialState } from '../initialState'

// re-export State as it's imported mainly in redux actions
export type State = InitialState

export type SegmentReducer<Segment, Payload> = (state: Segment, payload: Payload) => Segment
export type GenericAction<Payload> = {
  type: string,
  payload: Payload,
  reducer: SegmentReducer<State, Payload>,
  undoable?: boolean,
  loggable?: boolean,
}

export type Dispatch = (action: GenericAction<*>) => null
export type GetState = () => State
export type Thunk = (dispatch: Dispatch, getState: any) => ?Promise<void>

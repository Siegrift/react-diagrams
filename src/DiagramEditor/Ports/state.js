// @flow
import type { StateDraft } from '../../initialState'
export const PATH_PORTS = ['ports']

// FLOW: TBD, key is actually editorKey
export type PortState = { [key: string]: any }

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedPortState = {
  ports: PortState,
}

export const setInitialState = (state: StateDraft): StateDraft & AppliedPortState => ({
  ...state,
  [PATH_PORTS]: {},
})

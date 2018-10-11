// @flow
import type { StateDraft } from '../../../flow/reduxTypes'
import type { AppliedPortState } from './flow'

export const PATH_PORTS = ['ports']

export const setInitialState = (state: StateDraft): StateDraft & AppliedPortState => ({
  ...state,
  [PATH_PORTS.toString()]: {},
})

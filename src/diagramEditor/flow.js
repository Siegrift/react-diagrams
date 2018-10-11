// @flow
export type AppState = {
  history: any[],
  historyIndex: number,
}
// NOTE: Needs to be updated when PATH in state changes
export type AppliedAppState = { app: AppState }

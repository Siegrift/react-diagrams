// @flow
import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'
import getInitialState from './initialState'
import historyMiddleware from './history'

import type { GetState, GenericAction } from './flow/reduxTypes'

export default () => {
  const logger = {
    log: (message: string, payload: Object) => null,
  }
  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (getState: GetState, action: GenericAction<*>) => !(action.loggable === false),
    actionTransformer: (action: GenericAction<*>) => ({ ...action, type: `RD: ${action.type}` }),
  })

  const middlewares = [thunk.withExtraArgument(logger), historyMiddleware]
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(rootReducer, getInitialState(), applyMiddleware(...middlewares))

  if (process.env.NODE_ENV === 'development') {
    logger.log = (message: string, payload: Object) =>
      // FLOW: enables logging in thunks
      store.dispatch({
        type: message,
        payload,
      })
  }

  return store
}

import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'
import getInitialState from './initialState'
import historyMiddleware from './history'

export default () => {
  const logger = {
    log: () => null,
  }
  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (getState, action) => !action.notLogable,
    actionTransformer: (action) => ({ ...action, type: `RD: ${action.type}` }),
  })

  const middlewares = [
    thunk.withExtraArgument({ logger }),
    historyMiddleware,
  ]
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(
      loggerMiddleware,
    )
  }

  const store = createStore(
    rootReducer,
    getInitialState(),
    applyMiddleware(...middlewares)
  )

  if (process.env.NODE_ENV === 'development') {
    logger.log = (message, payload) => store.dispatch({
      type: message,
      payload,
    })
  }

  return store
}

import React from 'react'
import { Provider } from 'react-redux'
import DiagramEditor from './DiagramEditor'
import getConfiguredStore from './configureStore'
// extend bluebird promise in dev mode
Promise.config({
  longStackTraces: process.env.NODE_ENV === 'development',
  warnings: process.env.NODE_ENV === 'development',
})
const store = getConfiguredStore()
export default (props) => (
  <Provider store={store}>
    <DiagramEditor {...props} />
  </Provider>
)

import React from 'react'
import { connect } from 'react-redux'
import { buttonTextSelector } from './state'
import { toggleButtonText } from './actions'

const App = ({ buttonText, toggleButtonText }) => (
  <div>
    <button onClick={toggleButtonText}>{buttonText}</button>
  </div>
)

export default connect(
  (state) => ({
    buttonText: buttonTextSelector(state),
  }),
  {
    toggleButtonText,
  },
)(App)

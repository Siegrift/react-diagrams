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

class DiagramEditorWrapper extends React.Component {
  static editorRef = undefined

  exportGraph() {
    return this.editorRef.exportGraph()
  }

  render() {
    return (
      <Provider store={store}>
        <DiagramEditor
          ref={(ref) => {
            this.editorRef = ref.getWrappedInstance()
          }}
          {...this.props}
        />
      </Provider>
    )
  }
}

export default DiagramEditorWrapper

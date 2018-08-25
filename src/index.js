// @flow
import React from 'react'
import { Provider } from 'react-redux'
import DiagramEditor from './DiagramEditor/DiagramEditor'
import getConfiguredStore from './configureStore'

import type { DiagramEditorApi } from './DiagramEditor/DiagramEditor'
import type { Schema } from './flowTypes'

const store = getConfiguredStore()

class DiagramEditorWrapper extends React.Component<Schema> {
  editorRef: ?DiagramEditorApi
  store: any

  exportGraph() {
    if (!this.editorRef) return undefined
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

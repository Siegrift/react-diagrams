// @flow
import * as React from 'react'
import { Provider } from 'react-redux'
import DiagramEditor from './diagramEditor/DiagramEditor'
import getConfiguredStore from './configureStore'

import type { DiagramEditorApi } from './diagramEditor/DiagramEditor'
import type { Schema } from './flow/schemaTypes'
import type { ExportedGraph } from './diagramEditor/editorApi'

const store = getConfiguredStore()

type DiagramEditorRef = { getWrappedInstance: () => DiagramEditorApi }

class DiagramEditorWrapper extends React.Component<Schema> {
  editorRef: ?DiagramEditorApi

  exportGraph(): ?ExportedGraph {
    if (!this.editorRef) return undefined
    return this.editorRef.exportGraph()
  }

  render(): React.Node {
    return (
      <Provider store={store}>
        <DiagramEditor
          // FLOW: flow doesn't understand getWrappedInstance from connectAdvanced
          ref={(ref: DiagramEditorRef) => {
            this.editorRef = ref.getWrappedInstance()
          }}
          {...this.props}
        />
      </Provider>
    )
  }
}

export default DiagramEditorWrapper

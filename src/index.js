// @flow
import * as React from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import DiagramEditor from './diagramEditor/DiagramEditor'
import getConfiguredStore from './configureStore'

import type { ExportedGraph } from './diagramEditor/editorApi'
import type { DiagramEditorApi } from './diagramEditor/DiagramEditor'
import type { Schema } from './flow/schemaTypes'

const store = getConfiguredStore()

type DiagramEditorRef = { getWrappedInstance: () => DiagramEditorApi }

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

export class DiagramEditorWrapper extends React.Component<Schema> {
  editorRef: ?DiagramEditorApi

  exportGraph(): ?ExportedGraph {
    if (!this.editorRef) return undefined
    return this.editorRef.exportGraph()
  }

  render(): React.Node {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <Provider store={store}>
            <DiagramEditor
              // FLOW: flow doesn't understand getWrappedInstance from connectAdvanced
              ref={(ref: DiagramEditorRef) => {
                this.editorRef = ref.getWrappedInstance()
              }}
              {...this.props}
            />
          </Provider>
        </CssBaseline>
      </MuiThemeProvider>
    )
  }
}

export default DiagramEditorWrapper

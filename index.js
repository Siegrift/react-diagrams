// This file is not processed by check_flow.py script
import React from 'react'
import DiagramEditor from './src'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

// MuiThemeProvider uses ref, which can be used only with statefull components
class Editor extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <DiagramEditor {...this.props} />
      </MuiThemeProvider>
    )
  }
}
export default Editor

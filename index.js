// This file is not processed by check_flow.py script
import React from 'react'
import DiagramEditor from './src'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

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
        <CssBaseline>
          <DiagramEditor {...this.props} />
        </CssBaseline>
      </MuiThemeProvider>
    )
  }
}
export default Editor

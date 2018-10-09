import React from 'react'
import { connect } from 'react-redux'
import './_TopPanel.scss'

import UndoIcon from 'react-icons/lib/md/undo'
import RedoIcon from 'react-icons/lib/md/redo'
import DeleteIcon from 'react-icons/lib/md/delete'
import SaveIcon from 'react-icons/lib/md/save'
import LoadIcon from 'react-icons/lib/md/file-download'
import { deleteSelection, localStorageLoad, localStorageSave, redo, undo } from '../actions'
import { selectedNodesSelector } from '../mainEditor/selectors'
import { cancelableSelector, redoableSelector, undoableSelector } from '../state'
import { isLoadingAvailable } from '../diagramUtils'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

const TopPanelItem = ({ disabled, onClick, text, children }) => (
  <Tooltip title={text} enterDelay={500}>
    <div>
      <IconButton text={text} onClick={onClick} disabled={disabled} className="TopPanel__Item">
        {children}
      </IconButton>
    </div>
  </Tooltip>
)

const TopPanel = ({
  undo,
  redo,
  undoable,
  redoable,
  deleteSelection,
  currentSelection,
  localStorageSave,
  localStorageLoad,
}) => (
  <AppBar position="static" className="TopPanel">
    <Toolbar variant="dense">
      <Typography variant="title" color="inherit">
        Diagrams
      </Typography>

      <TopPanelItem onClick={undo} disabled={!undoable} text="Krok späť">
        <UndoIcon />
      </TopPanelItem>

      <TopPanelItem onClick={redo} disabled={!redoable} text="Vykonať znova">
        <RedoIcon />
      </TopPanelItem>

      <TopPanelItem
        onClick={deleteSelection}
        disabled={!currentSelection.length}
        text="Vymazať označené"
      >
        <DeleteIcon />
      </TopPanelItem>

      <TopPanelItem onClick={localStorageSave} text="Uložiť">
        <SaveIcon />
      </TopPanelItem>

      <TopPanelItem onClick={localStorageLoad} text="Načítať" disabled={!isLoadingAvailable()}>
        <LoadIcon />
      </TopPanelItem>
    </Toolbar>
  </AppBar>
)

export default connect(
  (state) => ({
    undoable: undoableSelector(state),
    redoable: redoableSelector(state),
    cancelable: cancelableSelector(state),
    currentSelection: selectedNodesSelector(state),
  }),
  {
    undo,
    redo,
    deleteSelection,
    localStorageSave,
    localStorageLoad,
  }
)(TopPanel)

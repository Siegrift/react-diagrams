import React from 'react'
import { connect } from 'react-redux'
import './_TopPanel.scss'

import UndoIcon from 'react-icons/lib/md/undo'
import RedoIcon from 'react-icons/lib/md/redo'
import CancelIcon from 'react-icons/lib/md/cancel'
import DeleteIcon from 'react-icons/lib/md/delete'
import SaveIcon from 'react-icons/lib/md/save'
import LoadIcon from 'react-icons/lib/md/file-download'
import FormatIcon from 'react-icons/lib/md/format-shapes'
import {
  cancelSelection,
  deleteSelection,
  localStorageLoad,
  localStorageSave,
  redo,
  undo,
  formatDiagrams,
} from '../actions'
import { selectedNodesSelector } from '../mainEditor/selectors'
import {
  cancelableSelector,
  loadAvailableSelector,
  redoableSelector,
  topbarHeightSelector,
  undoableSelector,
} from '../state'
import PanelItem from './panelItem/PanelItem'

const TopPanel = ({
  topbarHeight,
  undo,
  redo,
  undoable,
  redoable,
  cancelable,
  cancelSelection,
  deleteSelection,
  currentSelection,
  localStorageSave,
  localStorageLoad,
  loadAvailable,
  formatDiagrams,
}) => (
  <div className="TopPanel" style={{ height: topbarHeight }}>
    <PanelItem text="Undo" onClick={undo} disabled={!undoable}>
      <UndoIcon />
    </PanelItem>
    <PanelItem text="Redo" onClick={redo} disabled={!redoable}>
      <RedoIcon />
    </PanelItem>
    <PanelItem text="Cancel selection" onClick={cancelSelection} disabled={!cancelable}>
      <CancelIcon />
    </PanelItem>
    <PanelItem text="Delete selected" onClick={deleteSelection} disabled={!currentSelection.length}>
      <DeleteIcon />
    </PanelItem>
    <PanelItem text="Save" onClick={localStorageSave}>
      <SaveIcon />
    </PanelItem>
    <PanelItem text="Load" onClick={localStorageLoad} disabled={!loadAvailable}>
      <LoadIcon />
    </PanelItem>
    <PanelItem text="Format" onClick={formatDiagrams}>
      <FormatIcon />
    </PanelItem>
  </div>
)

export default connect(
  (state) => ({
    topbarHeight: topbarHeightSelector(state),
    undoable: undoableSelector(state),
    redoable: redoableSelector(state),
    cancelable: cancelableSelector(state),
    currentSelection: selectedNodesSelector(state),
    loadAvailable: loadAvailableSelector(state),
  }),
  {
    undo,
    redo,
    cancelSelection,
    deleteSelection,
    localStorageSave,
    localStorageLoad,
    formatDiagrams,
  }
)(TopPanel)

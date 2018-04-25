import React from 'react'
import PanelItem from './PanelItem'
import { connect } from 'react-redux'
import { topbarHeightSelector, undoableSelector, redoableSelector, cancelableSelector } from '../state'
import { selectedNodesSelector } from '../MainEditor/state'
import './_TopPanel.scss'
import { undo, redo, cancelSelection, deleteSelection } from '../actions'

import UndoIcon from 'react-icons/lib/md/undo'
import RedoIcon from 'react-icons/lib/md/redo'
import CancelIcon from 'react-icons/lib/md/cancel'
import DeleteIcon from 'react-icons/lib/md/delete'

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
  </div>
)

export default connect(
  (state) => ({
    topbarHeight: topbarHeightSelector(state),
    undoable: undoableSelector(state),
    redoable: redoableSelector(state),
    cancelable: cancelableSelector(state),
    currentSelection: selectedNodesSelector(state),
  }),
  { undo, redo, cancelSelection, deleteSelection }
)(TopPanel)

import React from 'react'
import PanelItem from './PanelItem'
import UndoIcon from 'react-icons/lib/md/undo'
import RedoIcon from 'react-icons/lib/md/redo'
import { connect } from 'react-redux'
import { topbarHeightSelector, undoableSelector, redoableSelector } from '../state'
import './_TopPanel.scss'
import { undo, redo } from '../actions'

const TopPanel = ({ topbarHeight, undo, redo, undoable, redoable }) => (
  <div className="TopPanel" style={{ height: topbarHeight }}>
    <PanelItem text="Undo" onClick={undo} disabled={!undoable}>
      <UndoIcon />
    </PanelItem>
    <PanelItem text="Redo" onClick={redo} disabled={!redoable}>
      <RedoIcon />
    </PanelItem>
  </div>
)

export default connect(
  (state) => ({
    topbarHeight: topbarHeightSelector(state),
    undoable: undoableSelector(state),
    redoable: redoableSelector(state),
  }),
  { undo, redo }
)(TopPanel)

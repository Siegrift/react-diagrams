import React from 'react'
import { connect } from 'react-redux'
import './_TopPanel.scss'

import UndoIcon from 'react-icons/lib/md/undo'
import RedoIcon from 'react-icons/lib/md/redo'
import CancelIcon from 'react-icons/lib/md/cancel'
import DeleteIcon from 'react-icons/lib/md/delete'
import SaveIcon from 'react-icons/lib/md/save'
import LoadIcon from 'react-icons/lib/md/file-download'
import {
  cancelSelection,
  deleteSelection,
  localStorageLoad,
  localStorageSave,
  redo,
  undo,
} from '../actions'
import { selectedNodesSelector } from '../mainEditor/selectors'
import {
  cancelableSelector,
  redoableSelector,
  topbarHeightSelector,
  undoableSelector,
} from '../state'
import { isLoadingAvailable } from '../diagramUtils'
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
}) => (
  <div className="TopPanel" style={{ height: topbarHeight }}>
    <PanelItem text="Krok späť" onClick={undo} disabled={!undoable}>
      <UndoIcon />
    </PanelItem>
    <PanelItem text="Vykonať znova" onClick={redo} disabled={!redoable}>
      <RedoIcon />
    </PanelItem>
    <PanelItem text="Zrušit označenie" onClick={cancelSelection} disabled={!cancelable}>
      <CancelIcon />
    </PanelItem>
    <PanelItem
      text="Vymazať označené"
      onClick={deleteSelection}
      disabled={!currentSelection.length}
    >
      <DeleteIcon />
    </PanelItem>
    <PanelItem text="Uložiť" onClick={localStorageSave}>
      <SaveIcon />
    </PanelItem>
    <PanelItem text="Načítať" onClick={localStorageLoad} disabled={!isLoadingAvailable()}>
      <LoadIcon />
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
  {
    undo,
    redo,
    cancelSelection,
    deleteSelection,
    localStorageSave,
    localStorageLoad,
  }
)(TopPanel)

import React from 'react'
import TopPanel from './TopPanel'
import './_DiagramEditor.scss'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withHandlers, compose, lifecycle } from 'recompose'
import { topbarHeightSelector, sidebarWidthSelector } from './state'
import { changeTopbarHeight, changeSidebarWidth, initializeEditor } from './actions'
import Splitter from '../componennts/Splitter/Splitter'
import SidePanel from './SidePanel'
import MainEditor from './MainEditor'

const DiagramEditor = ({ topbarHeight, className, onTopbarHeightChange,
  onSidebarWidthChange, sidebarWidth, schema,
}) => (
  <div
    onContextMenu={(e) => e.preventDefault()}
    className={classnames('DiagramEditor', className)}
  >
    <Splitter
      vertical
      primaryIndex={1}
      secondarySize={topbarHeight}
      onChange={onTopbarHeightChange}
    >
      <TopPanel />
      <Splitter secondarySize={sidebarWidth} primaryIndex={1} onChange={onSidebarWidthChange}>
        <SidePanel schema={schema} />
        <MainEditor schema={schema} />
      </Splitter>
    </Splitter>
  </div >
)

export default compose(
  connect(
    (state) => ({
      topbarHeight: topbarHeightSelector(state),
      sidebarWidth: sidebarWidthSelector(state),
    }),
    {
      changeTopbarHeight,
      changeSidebarWidth,
      initializeEditor,
    },
  ),
  withHandlers({
    onTopbarHeightChange: (props) => (newTopbarHeight) => {
      props.changeTopbarHeight(newTopbarHeight)
    },
    onSidebarWidthChange: (props) => (newSidebarWidth) => {
      props.changeSidebarWidth(newSidebarWidth)
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.initializeEditor()
    },
  })
)(DiagramEditor)

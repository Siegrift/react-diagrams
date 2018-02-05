import React from 'react'
import SplitterLayout from 'react-splitter-layout'
import TopPanel from './TopPanel'
import CenterPanel from './CenterPanel'
import './_DiagramEditor.scss'

const DiagramEditor = ({ className }) => (
  <div className={`DiagramEditor ${className || ''}}`}>
    <SplitterLayout vertical primaryIndex={1} secondaryInitialSize={30}>
      <TopPanel />
      <CenterPanel />
    </SplitterLayout>
  </div >
)

export default DiagramEditor

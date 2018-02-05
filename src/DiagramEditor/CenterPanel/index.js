import React from 'react'
import SplitterLayout from 'react-splitter-layout'
import SidePanel from './SidePanel'
import MainEditor from './MainEditor'


const DiagramEditor = () => (
  <SplitterLayout secondaryInitialSize={200} primaryIndex={1} >
    <SidePanel />
    <MainEditor />
  </SplitterLayout>
)

export default DiagramEditor

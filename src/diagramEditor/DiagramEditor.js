// @flow
import React from 'react'
import TopPanel from './topPanel/TopPanel'
// FLOW: css/css imports are not recognized by flow
import './_DiagramEditor.scss'
import classnames from 'classnames'
import { connectAdvanced } from 'react-redux'
import { sidebarWidthSelector, topbarHeightSelector } from './state'
import { changeSidebarWidth, changeTopbarHeight, initializeEditor } from './actions'
import Splitter from '../components/splitter/Splitter'
import SidePanel from './sidePanel/SidePanel'
import MainEditor from './mainEditor/MainEditor'
import { bindActionCreators } from 'redux'
import { shallowEqual } from '../utils'
import { apiExportGraph } from './editorApi'

import type { State } from '../initialState'

// TODO: TBD
export type DiagramEditorApi = {
  exportGraph: () => any,
}

type Props = {
  apiExportGraph: Function,
  changeTopbarHeight: Function,
  changeSidebarWidth: Function,
  initializeEditor: Function,
  className: string,
  topbarHeight: number,
  sidebarWidth: number,
  schema: number,
}

class DiagramEditor extends React.Component<Props> {
  exportGraph = () => this.props.apiExportGraph()

  onTopbarHeightChange = (newTopbarHeight: number) => {
    this.props.changeTopbarHeight(newTopbarHeight)
  }
  onSidebarWidthChange = (newSidebarWidth: number) => {
    this.props.changeSidebarWidth(newSidebarWidth)
  }

  componentDidMount() {
    this.props.initializeEditor()
  }

  render() {
    const { className, topbarHeight, sidebarWidth, schema } = this.props
    return (
      <div
        onContextMenu={(e: Event) => e.preventDefault()}
        className={classnames('DiagramEditor', className)}
      >
        <Splitter
          vertical
          primaryIndex={1}
          secondarySize={topbarHeight}
          onChange={this.onTopbarHeightChange}
        >
          <TopPanel />
          <Splitter
            secondarySize={sidebarWidth}
            primaryIndex={1}
            onChange={this.onSidebarWidthChange}
          >
            <SidePanel schema={schema} />
            <MainEditor schema={schema} />
          </Splitter>
        </Splitter>
      </div>
    )
  }
}

const mapStateToProps = (state: State) => ({
  topbarHeight: topbarHeightSelector(state),
  sidebarWidth: sidebarWidthSelector(state),
})

const mapActionsToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      changeTopbarHeight,
      changeSidebarWidth,
      initializeEditor,
      apiExportGraph,
    },
    dispatch
  )

const selectorFactory = (dispatch: Dispatch) => {
  let result = {}
  return (nextState: State, nextOwnProps: Props) => {
    const nextResult = {
      ...nextOwnProps,
      ...mapStateToProps(nextState),
      ...mapActionsToProps(dispatch),
    }
    if (!shallowEqual(result, nextResult)) result = nextResult
    return result
  }
}

export default connectAdvanced(selectorFactory, {
  withRef: true,
})(DiagramEditor)

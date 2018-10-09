// @flow
import React from 'react'
import TopPanel from './topPanel/TopPanel'
// FLOW: css/css imports are not recognized by flow
import './_DiagramEditor.scss'
import classnames from 'classnames'
import { connectAdvanced } from 'react-redux'
import { changeSidebarWidth, initializeEditor } from './actions'
import SplitPane from 'react-split-pane'
import SidePanel from './sidePanel/SidePanel'
import MainEditor from './mainEditor/MainEditor'
import { bindActionCreators } from 'redux'
import { shallowEqual } from '../utils'
import { apiExportGraph } from './editorApi'

import type { State, Dispatch } from '../flow/reduxTypes'
import type { Schema } from '../flow/schemaTypes'
import type { Dispatch as GeneralDispatch } from 'redux'

const DEFAULT_SIDEBAR_SIZE = 150

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
  schema: Schema,
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
    const { className, schema } = this.props
    return (
      <div
        onContextMenu={(e: Event) => e.preventDefault()}
        className={classnames('DiagramEditor', className)}
      >
        <TopPanel />
        <SplitPane split="vertical" size={DEFAULT_SIDEBAR_SIZE} resizerClassName="Resizer">
          <SidePanel schema={schema} />
          <MainEditor schema={schema} />
        </SplitPane>
      </div>
    )
  }
}

const mapActionsToProps = (dispatch: GeneralDispatch<any>) =>
  bindActionCreators(
    {
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
      ...mapActionsToProps(dispatch),
    }
    if (!shallowEqual(result, nextResult)) result = nextResult
    return result
  }
}

export default connectAdvanced(selectorFactory, {
  withRef: true,
})(DiagramEditor)

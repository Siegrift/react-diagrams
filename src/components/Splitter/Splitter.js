// @flow
import * as React from 'react'
import classnames from 'classnames'
import Pane from './Pane'
// FLOW: css/css imports are not recognized by flow
import './_Splitter.scss'

type Props = {
  className: string,
  vertical: boolean,
  percentage: boolean,
  primaryIndex: number,
  primaryMinSize: number,
  secondarySize: number,
  secondaryMinSize: number,
  onChange?: Function,
  children: React.Node[],
}
type State = {
  resizing: boolean,
}

// FLOW: move to common types
export type BoundingRectClient = {
  top: number,
  botton: number,
  left: number,
  right: number,
  x: number,
  y: number,
  width: number,
  height: number,
}

type ClientPosition = {
  top: number,
  left: number,
}

class SplitterLayout extends React.Component<Props, State> {
  container: any
  splitter: any
  static defaultProps: Props

  constructor(props: Props) {
    super(props)
    this.state = {
      resizing: false,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  getSecondaryPaneSize = (
    containerRect: BoundingRectClient,
    splitterRect: BoundingRectClient,
    clientPosition: ClientPosition,
    offsetMouse: boolean
  ) => {
    const { primaryMinSize, secondaryMinSize, vertical, primaryIndex, percentage } = this.props
    let totalSize
    let splitterSize
    let offset
    if (vertical) {
      totalSize = containerRect.height
      splitterSize = splitterRect.height
      offset = clientPosition.top - containerRect.top
    } else {
      totalSize = containerRect.width
      splitterSize = splitterRect.width
      offset = clientPosition.left - containerRect.left
    }
    if (offsetMouse) {
      offset -= splitterSize / 2
    }
    if (offset < 0) {
      offset = 0
    } else if (offset > totalSize - splitterSize) {
      offset = totalSize - splitterSize
    }

    let secondaryPaneSize
    if (primaryIndex === 1) {
      secondaryPaneSize = offset
    } else {
      secondaryPaneSize = totalSize - splitterSize - offset
    }
    let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize
    if (percentage) {
      secondaryPaneSize = (secondaryPaneSize * 100) / totalSize
      primaryPaneSize = (primaryPaneSize * 100) / totalSize
      splitterSize = (splitterSize * 100) / totalSize
      totalSize = 100
    }

    if (primaryPaneSize < primaryMinSize) {
      secondaryPaneSize = Math.max(secondaryPaneSize - (primaryMinSize - primaryPaneSize), 0)
    } else if (secondaryPaneSize < secondaryMinSize) {
      secondaryPaneSize = Math.min(totalSize - splitterSize - primaryMinSize, secondaryMinSize)
    }

    return secondaryPaneSize
  }

  handleResize = () => {
    if (this.splitter && !this.props.percentage) {
      const containerRect = this.container.getBoundingClientRect()
      const splitterRect = this.splitter.getBoundingClientRect()
      const secondaryPaneSize = this.getSecondaryPaneSize(
        containerRect,
        splitterRect,
        {
          left: splitterRect.left,
          top: splitterRect.top,
        },
        false
      )
      if (this.props.onChange) this.props.onChange(secondaryPaneSize)
    }
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.state.resizing) {
      const containerRect = this.container.getBoundingClientRect()
      const splitterRect = this.splitter.getBoundingClientRect()
      const secondaryPaneSize = this.getSecondaryPaneSize(
        containerRect,
        splitterRect,
        {
          left: e.clientX,
          top: e.clientY,
        },
        true
      )
      window.getSelection().removeAllRanges()
      if (this.props.onChange) this.props.onChange(secondaryPaneSize)
    }
  }

  handleSplitterMouseDown = () => {
    window.getSelection().removeAllRanges()
    this.setState({ resizing: true })
  }

  handleMouseUp = () => {
    this.setState({ resizing: false })
  }

  render() {
    const primaryIndex = this.props.primaryIndex
    const wrappedChildren = this.props.children.map((child, index) => (
      <Pane
        key={index}
        vertical={this.props.vertical}
        percentage={this.props.percentage}
        primary={primaryIndex === index}
        size={primaryIndex === index ? 0 : this.props.secondarySize}
      >
        {child}
      </Pane>
    ))
    const classes = classnames('splitter-layout', this.props.className, {
      'splitter-layout-vertical': this.props.vertical,
      'layout-changing': this.state.resizing,
    })
    return (
      <div
        className={classes}
        ref={(c) => {
          this.container = c
        }}
      >
        {wrappedChildren[0]}
        <div
          role="separator"
          className="layout-splitter"
          ref={(c) => {
            this.splitter = c
          }}
          onMouseDown={this.handleSplitterMouseDown}
        />
        {wrappedChildren[1]}
      </div>
    )
  }
}

SplitterLayout.defaultProps = {
  className: '',
  vertical: false,
  percentage: false,
  primaryIndex: 0,
  primaryMinSize: 0,
  secondarySize: 0,
  secondaryMinSize: 0,
  children: [],
}

export default SplitterLayout

// @flow
import * as React from 'react'

type Props = {
  vertical: boolean,
  primary: boolean,
  size: number,
  percentage: boolean,
  children: React.Node | React.Node[],
}

const Pane = (props: Props) => {
  const size = props.size || 0
  const unit = props.percentage ? '%' : 'px'
  let classes = 'layout-pane'
  const style = {}
  if (!props.primary) {
    if (props.vertical) {
      style.height = `${size}${unit}`
    } else {
      style.width = `${size}${unit}`
    }
  } else {
    classes += ' layout-pane-primary'
  }
  return (
    <div className={classes} style={style}>
      {props.children}
    </div>
  )
}

// TODO: use defaultProps from recompose
Pane.defaultProps = {
  vertical: false,
  primary: false,
  size: 0,
  percentage: false,
  children: [],
}

export default Pane

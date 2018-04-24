import React from 'react'
import classNames from 'classnames'
import './_PanelItem.scss'

const PanelItem = ({ icon, text, children, onClick, disabled }) => (
  <div
    className={classNames('PanelItem', { PanelItem__Disabled: disabled })}
    onClick={(e) => {
      !disabled && onClick(e)
    }}
  >
    {children}
    <span>{text}</span>
  </div>
)

export default PanelItem

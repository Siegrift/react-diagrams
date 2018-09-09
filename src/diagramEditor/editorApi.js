// @flow
import { omit, reduce } from 'lodash'
import { widgetsSelector } from './widgets/selectors'
import { linksSelector } from './links/selectors'
import type { Dispatch, GetState } from '../flow/reduxTypes'

import type { Widget } from './widgets/state'
import type { Link } from './links/state'
import type { EditorKey } from '../flow/commonTypes'

// TODO: TBD
export type ExportedGraph = {
  widgets: any,
  links: any,
}

export const apiExportGraph = () => (dispatch: Dispatch, getState: GetState): ExportedGraph => {
  const state = getState()
  const getWidgetToExport = (widget: Widget) => omit(widget, ['color', 'selected', 'x', 'y'])
  const getLinkToExport = (link: Link) => omit(link, ['path', 'selected'])
  const widgets = reduce(
    widgetsSelector(state),
    (acc: Object, widget: Widget, key: EditorKey) => {
      return {
        ...acc,
        [key]: getWidgetToExport(widget),
      }
    },
    {}
  )
  const links = reduce(
    linksSelector(state),
    (acc: Object, link: Link, key: EditorKey) => {
      return {
        ...acc,
        [key]: getLinkToExport(link),
      }
    },
    {}
  )
  return {
    widgets,
    links,
  }
}

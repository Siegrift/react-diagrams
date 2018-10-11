// @flow
import { omit, reduce } from 'lodash'
import { widgetsSelector } from './mainEditor/widgets/selectors'
import { linksSelector } from './mainEditor/links/selectors'
import type { Dispatch, GetState } from '../flow/reduxTypes'

import type { Widget } from './mainEditor/widgets/flow'
import type { Link } from './mainEditor/links/flow'
import type { EditorKey } from '../flow/commonTypes'

export type ExportedGraph = {
  widgets: Object,
  links: Object,
}

export const apiExportGraph = () => (dispatch: Dispatch, getState: GetState): ExportedGraph => {
  const state = getState()
  const getWidgetToExport = (widget: Widget) => omit(widget, ['selected', 'x', 'y'])
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

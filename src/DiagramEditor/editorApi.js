import { omit, reduce } from 'lodash'
import { widgetsSelector } from './Widgets/selectors'
import { linksSelector } from './Links/selectors'

export const apiExportGraph = () => (dispatch, getState) => {
  const state = getState()
  const getWidgetToExport = (widget) => omit(widget, ['color', 'selected', 'x', 'y'])
  const getLinkToExport = (link) => omit(link, ['path', 'selected'])
  const widgets = reduce(
    widgetsSelector(state),
    (acc, widget, key) => {
      return {
        ...acc,
        [key]: getWidgetToExport(widget),
      }
    },
    {}
  )
  const links = reduce(
    linksSelector(state),
    (acc, link, key) => {
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

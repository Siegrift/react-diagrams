// TODO: remove after refactor
const x = (position) => ({
  type: 'Editor mouse move',
  payload: { position },
  loggable: false,
  reducer: (state) => {
    let newState = setIn(state, PATH_CURSOR, position)
    if (draggingSelector(newState)) {
      const diff = computeDiff(cursorSelector(newState), cursorSelector(state))
      if (some(widgetsSelector(newState), (w) => w.selected)) {
        const selectedKeys = map(
          filter(widgetsSelector(newState), (w) => w.selected),
          (w) => w.editorKey
        )
        const newWidgets = selectedKeys.reduce((acc, key) => {
          const movedWidget = update(widgetsSelector(newState)[key], {
            x: { $sum: diff.x / zoomSelector(state) },
            y: { $sum: diff.y / zoomSelector(state) },
          })
          return { ...acc, [key]: movedWidget }
        }, {})
        let linkPoints = linkPointsSelector(newState)
        // TODO: split this reduce
        const links = reduce(
          linksSelector(newState),
          (acc, value, key) => {
            const moveLast = selectedKeys.find((key) => {
              return (
                some(
                  getWidgetByEditorKey(newState, key).outPortKeys,
                  (portKey) => portKey === value.destination
                ) ||
                some(
                  getWidgetByEditorKey(newState, key).inPortKeys,
                  (portKey) => portKey === value.destination
                )
              )
            })
            const moveFirst = selectedKeys.find((key) => {
              return (
                some(
                  getWidgetByEditorKey(newState, key).inPortKeys,
                  (portKey) => portKey === value.source
                ) ||
                some(
                  getWidgetByEditorKey(newState, key).outPortKeys,
                  (portKey) => portKey === value.source
                )
              )
            })
            if (moveFirst) {
              const key = value.path[0]
              linkPoints = {
                ...linkPoints,
                [key]: {
                  ...linkPoints[key],
                  x: linkPoints[key].x + diff.x / zoomSelector(newState),
                  y: linkPoints[key].y + diff.y / zoomSelector(newState),
                },
              }
            }
            if (moveLast) {
              const key = value.path[value.path.length - 1]
              linkPoints = {
                ...linkPoints,
                [key]: {
                  ...linkPoints[key],
                  x: linkPoints[key].x + diff.x / zoomSelector(newState),
                  y: linkPoints[key].y + diff.y / zoomSelector(newState),
                },
              }
            }
            return { ...acc, [key]: value }
          },
          {}
        )
        newState = {
          ...newState,
          widgets: { ...widgetsSelector(newState), ...newWidgets },
          links: { ...linksSelector(newState), ...links },
          linkPoints,
        }
      }

      if (some(linksSelector(newState), (link) => link.selected)) {
        const selectedKeys = map(
          filter(linksSelector(newState), (link) => link.selected),
          (link) => link.editorKey
        )
        const newLinks = selectedKeys.reduce((acc, key) => {
          const movedLink = update(linksSelector(newState)[key], {
            path: {
              $set: linksSelector(newState)[key].path.map((point, index) => {
                if (index === 0 || index === linksSelector(newState)[key].path.length - 1) {
                  return point
                }
                return {
                  ...point,
                  x: point.x + diff.x / zoomSelector(state),
                  y: point.y + diff.y / zoomSelector(state),
                }
              }),
            },
          })
          return { ...acc, [key]: movedLink }
        }, {})
        newState = {
          ...newState,
          links: { ...linksSelector(newState), ...newLinks },
        }
      }

      if (some(linksSelector(newState), (link) => some(link.path, (point) => point.selected))) {
        const newLinks = reduce(
          linksSelector(newState),
          (acc, link, key) => {
            return {
              ...acc,
              [key]: {
                ...link,
                path: link.path.map((point) => {
                  if (!selectedNodesSelector(state).includes(link.editorKey) && point.selected) {
                    return {
                      ...point,
                      x: point.x + diff.x / zoomSelector(state),
                      y: point.y + diff.y / zoomSelector(state),
                    }
                  } else {
                    return point
                  }
                }),
              },
            }
          },
          {}
        )
        newState = { ...newState, links: newLinks }
      }
      if (!selectedNodesSelector(state).length) {
        newState = update(newState, {
          editor: {
            canvas: {
              offset: {
                x: { $sum: diff.x },
                y: { $sum: diff.y },
              },
            },
          },
        })
      }
    }
    return newState
  },
})

export const filterObject = (obj, objFilter) => (
  Object.keys(obj).reduce((accum, attr) => ((
    typeof objFilter[attr] === 'object'
      ? (accum[attr] = filterObject(obj[attr], objFilter[attr]))
      : (objFilter[attr] && (accum[attr] = obj[attr]))
    , accum
  )), {})
)

export const deepMergeFilterObject = (mergeInto, objFilter, mergeFromFiltered) => (
  Object.keys(mergeInto).reduce((accum, attr) => {
    objFilter[attr] === undefined || objFilter[attr] === false
      ? (accum[attr] = mergeInto[attr])
      : (
        typeof objFilter[attr] === 'object'
          ? (accum[attr] = deepMergeFilterObject(mergeInto[attr], objFilter[attr], mergeFromFiltered[attr]))
          : (accum[attr] = mergeFromFiltered[attr])
      )
    return accum
  }, {})
)

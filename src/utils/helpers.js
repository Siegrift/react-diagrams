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

export const is = (x, y) => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    // NaN == NaN
    // eslint-disable-next-line
    return x !== x && y !== y
  }
}

export const shallowEqual = (objA, objB) => {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
}

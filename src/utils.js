/*
 * Filters attributes of an object, based on a provided filter, into a new object.
 * Example:
 *   obj = {a: 10, b: {c: 20, d: 30}, e: {f: 40, g: 50}}
 *   objfilter = {a: false, b: {c: true}, e: true}
 *   returns a new object {b: {c: 20}, e: {f: 40, g: 50}}
 * Note: In case of filtering whole objects, only a reference is copied. So in
 *   previous example, new object's e === old object's e. This will not be the
 *   case, if we filter it like this: e: {f: true, g: true}.
 *
 * obj: an object to be filtered
 * objfilter: an object describing which attributes to keep and which to lose
 * returns: a new object
 */
export const filterObject = (obj: Object, objFilter: Object): Object =>
  Object.keys(obj).reduce(
    (accum, attr) => (
      typeof objFilter[attr] === 'object'
        ? (accum[attr] = filterObject(obj[attr], objFilter[attr]))
        : // Eslint complains about the comma usage on next line
      // eslint-disable-next-line
          objFilter[attr] && (accum[attr] = obj[attr]),
      accum
    ),
    {}
  )

export const deepMergeFilterObject = (mergeInto, objFilter, mergeFromFiltered) =>
  Object.keys(mergeInto).reduce((accum, attr) => {
    objFilter[attr] === undefined || objFilter[attr] === false
      ? (accum[attr] = mergeInto[attr])
      : typeof objFilter[attr] === 'object'
        ? (accum[attr] = deepMergeFilterObject(
          mergeInto[attr],
          objFilter[attr],
          mergeFromFiltered[attr]
        ))
        : (accum[attr] = mergeFromFiltered[attr])
    return accum
  }, {})

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

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

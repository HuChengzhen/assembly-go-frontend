export function mapEquals(mapA, mapB) {
  if (mapA === mapB) {
    return true
  }

  if (mapA.size !== mapB.size) {
    return false
  }
  for (let [key, value] of mapA) {
    if (!mapB.has(key) || !mapB.get(key).equals(value)) {
      return false
    }
  }
  return true
}

export function deepCopyMap(originalMap) {
  const newMap = new Map()
  const map = new Map()
  originalMap.forEach((value, key) => {
    if (!map.has(value)) {
      const copy = deepCopy(value)
      map.set(value, copy)
      newMap.set(key, copy)
    } else {
      newMap.set(key, map.get(value))
    }
  })
  return newMap
}

function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy)
  }

  if (obj instanceof Map) {
    return deepCopyMap(obj)
  }

  if (obj instanceof Set) {
    return new Set(Array.from(obj, deepCopy))
  }

  const copiedObj = obj.copy()
  return copiedObj
}

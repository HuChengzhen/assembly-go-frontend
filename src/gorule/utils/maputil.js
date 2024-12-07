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
  originalMap.forEach((value, key) => {
    const copiedKey = deepCopy(key)
    const copiedValue = deepCopy(value)
    newMap.set(copiedKey, copiedValue)
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

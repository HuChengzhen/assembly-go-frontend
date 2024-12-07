export function setEquals(setA, setB) {
  if (setA.size !== setB.size) {
    return false
  }
  for (let item of setA) {
    if (!setB.has(item)) {
      return false
    }
  }
  return true
}

export function removeElementsFromSet(originalSet, elementsToRemove) {
  elementsToRemove.forEach((element) => {
    originalSet.delete(element)
  })
}

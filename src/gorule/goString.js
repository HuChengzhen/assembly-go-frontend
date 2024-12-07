import { removeElementsFromSet, setEquals } from '@/gorule/utils/setutil.js'

export class GoString {
  constructor(color, stones, liberties) {
    this.color = color
    this.stones = stones
    this.liberties = liberties
  }

  removeLiberty(point) {
    this.liberties.delete(point.toString())
  }

  addLiberty(point) {
    this.liberties.add(point.toString())
  }

  mergedWith(other) {
    if (this.color !== other.color) {
      throw new Error('Color not match.')
    }

    const combinedStones = new Set([...this.stones, ...other.stones])
    const liberties = new Set([...this.liberties, ...other.liberties])
    removeElementsFromSet(liberties, combinedStones)
    return new GoString(this.color, combinedStones, liberties)
  }

  numLiberties() {
    return this.liberties.size
  }

  equals(other) {
    if (this.color !== other.color) {
      return false
    }

    if (!setEquals(this.stones, other.stones)) {
      return false
    }

    if (!setEquals(this.liberties, other.liberties)) {
      return false
    }

    return true
  }

  copy() {
    return new GoString(this.color, new Set(this.stones), new Set(this.liberties))
  }
}

import { setEquals } from '@/gorule/utils/setutil.js'

class Gostring {
  constructor(color, stones, liberties) {
    this.color = color
    this.stones = stones
    this.liberties = liberties
  }

  removeLiberty(point) {
    this.liberties.delete(point)
  }

  addLiberty(point) {
    this.liberties.add(point)
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
}

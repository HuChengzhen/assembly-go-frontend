import { deepCopyMap, mapEquals } from '@/gorule/utils/maputil.js'
import { GoString } from '@/gorule/goString.js'
import { Point } from '@/gorule/point.js'

export class Board {
  constructor(boardSize) {
    this.numRows = boardSize
    this.numCols = boardSize
    this.grid = new Map()
  }

  placeStone(color, point) {
    if (!this.isOnGrid(point)) {
      throw new Error(`Point ${point} is outside the grid.`)
    }

    if (this.grid.has(point.toString())) {
      throw new Error(`Point ${point} already occupied.`)
    }

    const adjacentSameColor = []
    const adjacentOppositeColor = []
    const liberties = new Set()

    point.neighbors().forEach((neighbor) => {
      if (!this.isOnGrid(neighbor)) {
        return
      }

      const neighborString = this.grid.get(neighbor.toString())
      if (!neighborString) {
        liberties.add(neighbor.toString())
      } else if (neighborString.color.equals(color)) {
        if (!adjacentSameColor.includes(neighborString)) {
          adjacentSameColor.push(neighborString)
        }
      } else {
        if (!adjacentOppositeColor.includes(neighborString)) {
          adjacentOppositeColor.push(neighborString)
        }
      }
    })

    const stones = new Set()
    stones.add(point.toString())

    let newString = new GoString(color, stones, liberties)

    adjacentSameColor.forEach((string) => {
      newString = newString.mergedWith(string)
    })

    newString.stones.forEach((point) => {
      this.grid.set(point.toString(), newString)
    })

    adjacentOppositeColor.forEach((string) => {
      string.removeLiberty(point)
    })

    adjacentOppositeColor.forEach((string) => {
      if (string.numLiberties() === 0) {
        this.removeString(string)
      }
    })
  }

  removeString(string) {
    string.stones.forEach((pointString) => {
      const point = Point.fromString(pointString)
      point.neighbors().forEach((neighbor) => {
        const neighborString = this.grid.get(neighbor.toString())
        if (!neighborString) {
          return
        }
        if (neighborString !== string) {
          neighborString.addLiberty(point)
        }

        this.grid.delete(point.toString())
      })
    })
  }

  isOnGrid(point) {
    return (
      point.row >= 1 && point.row <= this.numRows && point.col >= 1 && point.col <= this.numCols
    )
  }

  getColor(point) {
    const string = this.grid.get(point.toString())
    if (string === undefined) {
      return null
    }

    return string.color
  }

  getGoString(point) {
    return this.grid.get(point.toString())
  }

  equals(other) {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      return false
    }
    // compare grid equality
    return mapEquals(this.grid, other.grid)
  }

  copy() {
    const board = new Board(this.numRows)
    board.grid = deepCopyMap(this.grid)
    return board
  }
}

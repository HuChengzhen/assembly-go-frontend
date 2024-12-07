class Point {
  constructor(row, col) {
    this.row = row
    this.col = col
  }

  neighbors() {
    return [
      new Point(this.row - 1, this.col),
      new Point(this.row + 1, this.col),
      new Point(this.row, this.col - 1),
      new Point(this.row, this.col + 1),
    ]
  }

  toString() {
    return `Point (${this.row}, ${this.col})`
  }
}

export class Point {
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

  static fromString(str) {
    const string = str.split(', ')
    const row = parseInt(string[0].substring(7))
    const col = parseInt(string[1].substring(0, string[1].length - 1))
    return new Point(row, col)
  }
}

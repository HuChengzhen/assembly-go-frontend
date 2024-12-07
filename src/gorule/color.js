class Color {
  static BlackColor = 1
  static WhiteColor = 2

  static Black = new Color(Color.BlackColor)
  static White = new Color(Color.WhiteColor)

  constructor(color) {
    this.color = color
  }

  other() {
    if (this.color === Color.BlackColor) {
      return Color.White
    } else if (this.color === Color.WhiteColor) {
      return Color.Black
    } else {
      throw new Error(`Unknown color ${this.color}`)
    }
  }

  toString() {
    if (this.color === Color.BlackColor) {
      return 'Black'
    } else if (this.color === Color.WhiteColor) {
      return 'White'
    } else {
      throw new Error(`Unknown color ${this.color}`)
    }
  }
}

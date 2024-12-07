class Move {
  constructor(point, isPass, isResign) {
    this.point = point
    this.ispass = isPass
    this.isResign = isResign
  }

  static newPassTurnMove() {
    return new Move(null, true, false)
  }

  static newResignMove() {
    return new Move(null, false, true)
  }

  isPlay() {
    return this.point !== null
  }
}

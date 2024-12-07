import { Board } from '@/gorule/board.js'
import { Color } from '@/gorule/color.js'

export class GameState {
  constructor(board, nextColor, previous, move) {
    this.board = board
    this.nextPlayer = nextColor
    this.previousState = previous
    this.lastMove = move
  }

  static newGame(boardSize) {
    return new GameState(new Board(boardSize), Color.Black, null, null)
  }

  applyMove(move) {
    if (!this.isValidMove(move)) {
      console.log('Invalid move')
      return this
    }

    let nextBoard
    if (move.isPlay()) {
      nextBoard = this.board.copy()
      nextBoard.placeStone(this.nextPlayer, move.point)
    } else {
      nextBoard = this.board
    }
    return new GameState(nextBoard, this.nextPlayer.other(), this, move)
  }

  isMoveSelfCapture(color, move) {
    if (!move.isPlay()) {
      return false
    }
    const nextBoard = this.board.copy()
    nextBoard.placeStone(color, move.point)
    const newString = nextBoard.getGoString(move.point)
    return newString.numLiberties() === 0
  }

  situation() {
    return new Situation(this.nextPlayer, this.board)
  }

  // 打劫冲突
  isViolateKo(color, move) {
    if (!move.isPlay()) {
      return false
    }

    const nextBoard = this.board.copy()
    nextBoard.placeStone(color, move.point)
    const next_situation = new Situation(color.other(), nextBoard)

    let pastState = this.previousState

    while (pastState) {
      if (pastState.situation().equals(next_situation)) {
        return true
      }
      pastState = pastState.previousState
    }

    return false
  }

  isValidMove(move) {
    if (this.isOver()) {
      return false
    }

    if (move.isPass || move.isResign) {
      return true
    }

    return (
      !this.board.getColor(move.point) &&
      !this.isMoveSelfCapture(this.nextPlayer, move) &&
      !this.isViolateKo(this.nextPlayer, move)
    )
  }

  isOver() {
    if (this.lastMove === null) {
      return false
    }

    if (this.lastMove.isResign) {
      return true
    }

    const secondLastMove = this.previousState.lastMove
    if (secondLastMove === null) {
      return false
    }

    return this.lastMove.isPass && secondLastMove.isPass
  }
}

class Situation {
  constructor(color, board) {
    this.nextColor = color
    this.board = board
  }

  equals(other) {
    return this.nextColor.equals(other.nextColor) && this.board.equals(other.board)
  }
}

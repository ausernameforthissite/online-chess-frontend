import { ChessColor } from "../../chess-game/ChessCommon"
import { BoardState } from "../../chess-game/BoardState"

export interface IMakeMoveResponse {
  myMove: boolean
  currentColor: ChessColor
  boardState: BoardState
}
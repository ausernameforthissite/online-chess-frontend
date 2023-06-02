import { BoardState } from "../../chess-game/BoardState"
import { IChessCoords } from "../../chess-game/ChessCommon"

export interface IViewCertainMoveDTO {
  boardState: BoardState
  moveNumber: number
  enPassantPawnCoords: IChessCoords | null
}
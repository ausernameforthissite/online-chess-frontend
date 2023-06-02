import { BoardState } from "../../chess-game/BoardState"
import { IChessCoords } from "../../chess-game/ChessCommon"
import { IChessMoveFullData } from "../../chess-game/IChessMove"

export interface IMakeChessMoveDTO {
  chessMove: IChessMoveFullData
  boardState?: BoardState
  enPassantPawnCoords?: IChessCoords | null
}
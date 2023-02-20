import { BoardState } from "../../chess-game/BoardState"
import { IChessCoords } from "../../chess-game/ChessCommon"
import { IChessMove, IChessMoveFullData } from "../../chess-game/IChessMove"

export interface IMakeChessMoveDTO {
  boardState?: BoardState
  chessMove: IChessMoveFullData
  enPassantPawnCoords?: IChessCoords | null
}
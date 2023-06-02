import { BoardState } from "../../chess-game/BoardState";
import { IChessCoords } from "../../chess-game/ChessCommon";
import { BoardCellEntityEnum} from "../../chess-game/IBoardCellEntity";


export interface ISelectChessPiece {
  boardState: BoardState
  selectChessPieceStart: ISelectChessPieceStart
}


export interface ISelectChessPieceStart {
  startPiece: BoardCellEntityEnum
  startCoords: IChessCoords
}

export interface ISelectChessPieceEnd {
  endPiece: BoardCellEntityEnum | null
  endCoords: IChessCoords
  castling?: number
  pawnPromotionPiece?: BoardCellEntityEnum
}
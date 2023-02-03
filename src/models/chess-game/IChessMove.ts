import { ChessPieceEnum, IChessCoords } from "./ChessCommon";

export enum chessMoveResult {
  check = "CHECK",
  mate = "MATE"
}


export interface IChessMove {
  startPiece: ChessPieceEnum
  startCoords: IChessCoords
  endPiece: ChessPieceEnum
  endCoords: IChessCoords
  castling: number
  pawnPromotionPiece: ChessPieceEnum
  chessMoveResult: chessMoveResult
}
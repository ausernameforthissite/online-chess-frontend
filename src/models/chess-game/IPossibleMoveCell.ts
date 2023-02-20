import { IChessCoords } from "./ChessCommon";
import { BoardCellEntityEnum, IBoardCellEntity } from "./IBoardCellEntity";

export interface IPossibleMoveCell extends IBoardCellEntity {
  castling?: number
}
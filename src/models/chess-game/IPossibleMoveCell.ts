import { IBoardCellEntity } from "./IBoardCellEntity";

export interface IPossibleMoveCell extends IBoardCellEntity {
  castling?: number
}
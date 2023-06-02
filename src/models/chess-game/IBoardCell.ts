import { IBoardCellEntity } from "./IBoardCellEntity";

export interface IBoardCell extends IBoardCellEntity {
  lastMove?: boolean
  possibleMove?: boolean
  castling?: number
}
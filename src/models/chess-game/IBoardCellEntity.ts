export enum BoardCellEntityEnum {
  boardCell = "boardCell",
  bishop = "bishop",
  king = "king",
  knight = "knight",
  pawn = "pawn",
  queen = "queen",
  rook = "rook"
}


export interface IBoardCellEntity {
  type: BoardCellEntityEnum
}



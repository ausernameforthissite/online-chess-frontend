export enum ChessColor {
  white = "WHITE",
  black = "BLACK"
}


export function getInvertedColor(inputColor: ChessColor): ChessColor {
  if (inputColor === ChessColor.white) {
    return ChessColor.black;
  } else {
      return ChessColor.white;
  }
}


export interface IChessCoords {
  numberCoord: number
  letterCoord: number
}

export function areCoordsEqual(fisrtCoords: IChessCoords, secondCoords: IChessCoords): boolean {

  if (fisrtCoords === undefined || fisrtCoords === null
      || secondCoords === undefined || secondCoords === null) {
        return false;
  }

  return fisrtCoords.numberCoord === secondCoords.numberCoord &&
          fisrtCoords.letterCoord === secondCoords.letterCoord;
}


export enum ChessPieceEnum {
  bishop = "BISHOP",
  king = "KING",
  knight = "KNIGHT",
  pawn = "PAWN",
  queen = "QUEEN",
  rook = "ROOK"
}

export const boardLength: number = 8
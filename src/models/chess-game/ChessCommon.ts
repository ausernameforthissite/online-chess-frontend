export enum ChessColor {
  white = "WHITE",
  black = "BLACK"
}

export enum ChessMoveViewStatus { default, selected }

export enum PieceViewStatus { default, selected, underAttack };


export function getInvertedColor(inputColor: ChessColor): ChessColor {
  if (inputColor === ChessColor.white) {
    return ChessColor.black;
  } else {
      return ChessColor.white;
  }
}

export function getUserColorByMoveNumber(currentMoveNumber: number): ChessColor {
  if (currentMoveNumber % 2 == 0) {
    return ChessColor.white;
  } else {
    return ChessColor.black;
  }
}


export interface IChessCoords {
  numberCoord: number
  letterCoord: number
}

export function areCoordsEqual(fisrtCoords: IChessCoords | null, secondCoords: IChessCoords | null): boolean {

  if (fisrtCoords === undefined || fisrtCoords === null
      || secondCoords === undefined || secondCoords === null) {
        return false;
  }

  return fisrtCoords.numberCoord === secondCoords.numberCoord &&
          fisrtCoords.letterCoord === secondCoords.letterCoord;
}






export const boardLength: number = 8
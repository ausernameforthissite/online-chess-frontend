import { BoardState } from "../BoardState";
import { IChessCoords, PieceViewStatus } from "../ChessCommon";
import { checkGoOrCapture, findKingCoords, IChessPiece, isCoordPossible } from "../exports";




export function findPossibleMovesKnight(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {

  currentPiece.viewStatus = PieceViewStatus.selected;
  const kingCoords: IChessCoords = findKingCoords(boardState, currentPiece.color) as IChessCoords;


  let newLetterCoord;
  let newNumberCoord;

  for(let i: number = -2; i <= 2; i++) {
    if (i === 0) {
      continue;
    }
    newNumberCoord = startCoords.numberCoord + i;

    if (isCoordPossible(newNumberCoord)) {

      for(let k: number = -1; k <= 1; k += 2) {
        newLetterCoord = startCoords.letterCoord + k * (3 - Math.abs(i))
        checkGoOrCapture(boardState, startCoords, {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords, currentPiece.color);
      }

    }

  }
}


export function isAttakingFieldKnight(startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  let newLetterCoord;
  let newNumberCoord;

  for(let i: number = -2; i <= 2; i++) {
    if (i === 0) {
      continue;
    }

    newNumberCoord = startCoords.numberCoord + i;

    if (newNumberCoord === endCoords.numberCoord) {
      for(let k: number = -1; k <= 1; k += 2) {
        newLetterCoord = startCoords.letterCoord + k * (3 - Math.abs(i))

        if (newLetterCoord === endCoords.letterCoord) {
          return true;
        }
      }
    } 
  }

  return false;
}
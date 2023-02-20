import { BoardState } from "../BoardState";
import { boardLength, ChessColor, IChessCoords, PieceViewStatus } from "../ChessCommon";
import { checkGoOrCapture, IChessPiece, isUnderAttack} from "../exports";
import { BoardCellEntityEnum, IBoardCellEntity } from "../IBoardCellEntity";
import { IPossibleMoveCell } from "../IPossibleMoveCell";



export function findPossibleMovesKing(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {

  currentPiece.viewStatus = PieceViewStatus.selected
  let newCoords: IChessCoords;

  for (let i: number = -1; i <= 1; i++) {
    
    for (let j: number = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      newCoords = {numberCoord: startCoords.numberCoord + i, letterCoord: startCoords.letterCoord + j}
      checkGoOrCapture(boardState, startCoords, newCoords, newCoords, currentPiece.color);
    }

  }

  checkCastling(currentPiece, boardState, startCoords)
}


function checkCastling(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {
  if (currentPiece.firstMove) {

    outerLoop:
    for (let i: number = -1; i <= 1; i += 2) {
      const rookInitialLetterCoord = i < 0 ? 0 : boardLength - 1;

      if (boardState[startCoords.numberCoord][rookInitialLetterCoord] !== null &&
          (<IBoardCellEntity>boardState[startCoords.numberCoord][rookInitialLetterCoord]).type === BoardCellEntityEnum.rook) {

        const myRook = <IChessPiece>boardState[startCoords.numberCoord][rookInitialLetterCoord]

        if (myRook.color === currentPiece.color && myRook.firstMove === true) {

          let j = startCoords.letterCoord;


          while (j != rookInitialLetterCoord - i) {
            j += i;
            if (boardState[startCoords.numberCoord][j] !== null &&
              (<IBoardCellEntity>boardState[startCoords.numberCoord][j]).type != BoardCellEntityEnum.boardCell) {
                
              continue outerLoop;
            }

          }

          j = startCoords.letterCoord - i;
          let endLetterCoord = startCoords.letterCoord + i * 2;

          while (j != endLetterCoord) {
            j += i;
            if (isUnderAttack(boardState, { numberCoord: startCoords.numberCoord, letterCoord: j}, currentPiece.color)) {
              continue outerLoop;
            }
          }

          boardState[startCoords.numberCoord][endLetterCoord] = <IPossibleMoveCell>{
            type: BoardCellEntityEnum.boardCell,
            castling: i
          };
        }
      }
    }
  }
}


export function isAttakingFieldKing(startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  return Math.abs(endCoords.numberCoord - startCoords.numberCoord) <= 1
          && Math.abs(endCoords.letterCoord - startCoords.letterCoord) <= 1;
}


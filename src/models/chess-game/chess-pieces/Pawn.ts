import _ from "lodash";
import { BoardState } from "../BoardState";
import { IChessCoords, ChessColor, areCoordsEqual, PieceViewStatus } from "../ChessCommon";
import { BoardCellEntityEnum, IBoardCellEntity } from "../IBoardCellEntity";
import { findKingCoords, IChessPiece, isCoordPossible, isUnderAttack, willBeCheck } from "../exports";
import { IPossibleMoveCell } from "../IPossibleMoveCell";





export function findPossibleMovesPawn(currentPiece: IChessPiece, boardState: BoardState, enPassantPawnCoords: IChessCoords | null, startCoords: IChessCoords): void {

  currentPiece.viewStatus = PieceViewStatus.selected
  const kingCoords: IChessCoords = findKingCoords(boardState, currentPiece.color) as IChessCoords;
  const direction: number = currentPiece.color === ChessColor.white ? +1 : -1;


  checkGoForward(currentPiece, boardState, direction, startCoords, kingCoords);
  checkCapture(currentPiece, boardState, enPassantPawnCoords, direction, startCoords, kingCoords);

}


function checkGoForward(currentPiece: IChessPiece, boardState: BoardState, direction: number, startCoords: IChessCoords, kingCoords: IChessCoords): void {
    for (let i: number = 1; i <= (currentPiece.firstMove ? 2 : 1); i++) {
      let endNumberCoord = startCoords.numberCoord + i * direction;

      if (boardState[endNumberCoord][startCoords.letterCoord] === null || (boardState[endNumberCoord][startCoords.letterCoord] as IBoardCellEntity).type === BoardCellEntityEnum.boardCell) {

        if (!willBeCheck(boardState, startCoords, {numberCoord: endNumberCoord, letterCoord: startCoords.letterCoord}, kingCoords, currentPiece.color)) {
          boardState[endNumberCoord][startCoords.letterCoord] = {type: BoardCellEntityEnum.boardCell} as IPossibleMoveCell;
        }

      } else {
        break;
      }
    }
  }


function checkCapture(currentPiece: IChessPiece, boardState: BoardState, enPassantPawnCoords: IChessCoords | null, direction: number, startCoords: IChessCoords, kingCoords: IChessCoords): void {
  for (let i: number = -1; i <= 1; i += 2) {

    const newLetterCoord = startCoords.letterCoord + i;
    const newNumberCoord = startCoords.numberCoord + direction;

    if (isCoordPossible(newLetterCoord)) {
      if (boardState[newNumberCoord][newLetterCoord] !== null && (boardState[newNumberCoord][newLetterCoord] as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
        checkNormalCapture(currentPiece, boardState,  startCoords, {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords)
      } else {
        checkEnPassant(currentPiece, boardState, enPassantPawnCoords, startCoords, {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords)
      }
    }

  }
}

function checkNormalCapture(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords): void {
  const endPiece = boardState[endCoords.numberCoord][endCoords.letterCoord] as IChessPiece;

  if (endPiece.color !== currentPiece.color && !willBeCheck(boardState, startCoords, endCoords, kingCoords, currentPiece.color)) {
    endPiece.viewStatus = PieceViewStatus.underAttack;
  }
}


function checkEnPassant(currentPiece: IChessPiece, boardState: BoardState, enPassantPawnCoords: IChessCoords | null, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords): void {

  if (areCoordsEqual(enPassantPawnCoords, {numberCoord: startCoords.numberCoord, letterCoord: endCoords.letterCoord}) && boardState[startCoords.numberCoord][endCoords.letterCoord] !== null
                      && (boardState[startCoords.numberCoord][endCoords.letterCoord] as IBoardCellEntity).type === BoardCellEntityEnum.pawn) {

    const enemyPawn = boardState[startCoords.numberCoord][endCoords.letterCoord] as IChessPiece;

    if (enemyPawn.color !== currentPiece.color) {

      const tempBoardState: BoardState = _.cloneDeep(boardState)
      tempBoardState[endCoords.numberCoord][endCoords.letterCoord] = currentPiece;
      tempBoardState[startCoords.numberCoord][endCoords.letterCoord] = null;
      tempBoardState[startCoords.numberCoord][startCoords.letterCoord] = null;
  
      if (!isUnderAttack(tempBoardState, kingCoords, currentPiece.color)) {
        boardState[endCoords.numberCoord][endCoords.letterCoord] = {type: BoardCellEntityEnum.boardCell} as IPossibleMoveCell;
      }

    }
  }

}


export function isAttakingFieldPawn(currentPiece: IChessPiece, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

  const direction: number = currentPiece.color === ChessColor.white ? +1 : -1;

  if (startCoords.numberCoord + direction !== endCoords.numberCoord) {
    return false;
  }

  if (startCoords.letterCoord - 1 === endCoords.letterCoord || startCoords.letterCoord + 1 === endCoords.letterCoord) {
    return true;
  } else {
    return false;
  }
}

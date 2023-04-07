import _ from "lodash";
import { boardLength, ChessColor, IChessCoords, PieceViewStatus } from "./ChessCommon";
import { BoardState } from "./BoardState";
import { IPossibleMoveCell } from "./IPossibleMoveCell";
import { BoardCellEntityEnum, IBoardCellEntity } from "./IBoardCellEntity";
import { findPossibleMovesBishop, isAttakingFieldBishop } from "./chess-pieces/Bishop";
import { findPossibleMovesKing, isAttakingFieldKing } from "./exports";
import { findPossibleMovesKnight, isAttakingFieldKnight } from "./chess-pieces/Knight";
import { findPossibleMovesPawn, isAttakingFieldPawn } from "./chess-pieces/Pawn";
import { findPossibleMovesQueen, isAttakingFieldQueen } from "./chess-pieces/Queen";
import { findPossibleMovesRook, isAttakingFieldRook } from "./chess-pieces/Rook";



export interface IChessPiece extends IBoardCellEntity {
  color: ChessColor;
  firstMove?: boolean
  viewStatus?: PieceViewStatus;
}


export function findPossibleMoves(chessPiece: IChessPiece, boardState: BoardState, enPassantPawnCoords: IChessCoords | null, startCoords: IChessCoords): void {
  switch (chessPiece.type) {
    case BoardCellEntityEnum.bishop:
      findPossibleMovesBishop(chessPiece, boardState, startCoords);
      break;
    case BoardCellEntityEnum.king:
      findPossibleMovesKing(chessPiece, boardState, startCoords);
      break;
    case BoardCellEntityEnum.knight:
      findPossibleMovesKnight(chessPiece, boardState, startCoords);
      break;
    case BoardCellEntityEnum.pawn:
      findPossibleMovesPawn(chessPiece, boardState, enPassantPawnCoords, startCoords);
      break;
    case BoardCellEntityEnum.queen:
      findPossibleMovesQueen(chessPiece, boardState, startCoords);
      break;
    case BoardCellEntityEnum.rook:
      findPossibleMovesRook(chessPiece, boardState, startCoords);
      break;
    default:
      throw new Error("Wrong chess piece type");
  }
}

export function isAttakingField(chessPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  switch (chessPiece.type) {
    case BoardCellEntityEnum.bishop:
      return isAttakingFieldBishop(boardState, startCoords, endCoords);
    case BoardCellEntityEnum.king:
      return isAttakingFieldKing(startCoords, endCoords);
    case BoardCellEntityEnum.knight:
      return isAttakingFieldKnight(startCoords, endCoords);
    case BoardCellEntityEnum.pawn:
      return isAttakingFieldPawn(chessPiece, startCoords, endCoords);
    case BoardCellEntityEnum.queen:
      return isAttakingFieldQueen(boardState, startCoords, endCoords);
    case BoardCellEntityEnum.rook:
      return isAttakingFieldRook(boardState, startCoords, endCoords);
    default:
      throw new Error("Wrong chess piece type");
  }
}


export function isUnderAttack(boardState: BoardState, endCoords: IChessCoords, myColor: ChessColor): boolean {
  for (let i: number = 0; i < boardLength; i++) {
    for(let j: number = 0; j < boardLength; j++) {
      if (boardState[i][j] !== null && (boardState[i][j] as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
        const chessPiece: IChessPiece = boardState[i][j] as IChessPiece;

        if (chessPiece.color !== myColor && isAttakingField(chessPiece, boardState, {numberCoord: i, letterCoord: j}, endCoords)) {
          return true;
        }

      }
    }
  }

  return false;
}


export function findKingCoords(boardState: BoardState, kingColor: ChessColor): IChessCoords {

  for (let i: number = 0; i < boardLength; i++) {
    for(let j: number = 0; j < boardLength; j++) {
      if (boardState[i][j] !== null && (boardState[i][j] as IBoardCellEntity).type === BoardCellEntityEnum.king && (boardState[i][j] as IChessPiece).color === kingColor) {
        return {numberCoord: i, letterCoord: j} ;
      }
    }
  }
  throw new Error("King was not found");
}


export function CheckGoDiagonal(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
  let newNumberCoord: number;
  let newLetterCoord: number;


  for (let i: number = -1; i <= 1; i += 2) {
    for (let j: number = -1; j <= 1; j += 2) {
      let k = 1;

      while (true) {
        newNumberCoord = startCoords.numberCoord + i * k;
        newLetterCoord = startCoords.letterCoord + j * k;

        if (!checkGoOrCapture(boardState, startCoords, { numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords, startPieceColor)) {
          break;
        }
    
        k++;
      }

    }
  }
}
  
export function CheckGoVertical(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
  let newNumberCoord;

  for (let i: number = -1; i <= 1; i += 2) {
    let k = 1;

    while (true) {
      newNumberCoord = startCoords.numberCoord + i * k;
      
      if (!checkGoOrCapture(boardState, startCoords, { numberCoord: newNumberCoord, letterCoord: startCoords.letterCoord }, kingCoords, startPieceColor)) {
        break;
      }
  
      k++;
    }
  
  }
}


export function CheckGoHorizontal(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
  let newLetterCoord;

  for (let j: number = -1; j <= 1; j += 2) {
    let k = 1;

    while (true) {
      newLetterCoord = startCoords.letterCoord + j * k;

      if (!checkGoOrCapture(boardState, startCoords, { numberCoord: startCoords.numberCoord, letterCoord: newLetterCoord }, kingCoords, startPieceColor)) {
        break;
      }
  
      k++;
    }
  
  }
}


export function checkGoOrCapture(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor): boolean {
  if (!areCoordsPossible(endCoords)) {
    return false;
  }

  if (boardState[endCoords.numberCoord][endCoords.letterCoord] === null || (boardState[endCoords.numberCoord][endCoords.letterCoord] as IBoardCellEntity).type === BoardCellEntityEnum.boardCell) {
    if (!willBeCheck(boardState, startCoords, endCoords, kingCoords, startPieceColor)) {
      boardState[endCoords.numberCoord][endCoords.letterCoord] = {type: BoardCellEntityEnum.boardCell} as IPossibleMoveCell;
    }
    return true;
  }


  const endPiece: IChessPiece = boardState[endCoords.numberCoord][endCoords.letterCoord] as IChessPiece;

  if (endPiece.color !== startPieceColor && !willBeCheck(boardState, startCoords, endCoords, kingCoords, startPieceColor)) {
    endPiece.viewStatus = PieceViewStatus.underAttack;
  }

  return false;
}


export function willBeCheck(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords,
                              kingCoords: IChessCoords, startPieceColor: ChessColor): boolean {
  const tempBoardState = _.cloneDeep(boardState);
  changeBoardStateOneMove(tempBoardState, startCoords, endCoords);
  return isUnderAttack(tempBoardState, kingCoords, startPieceColor);
}


export function isAttakingFieldDiagonal(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

  const deltaNumberCoord: number = endCoords.numberCoord - startCoords.numberCoord
  const deltaLetterCoord: number = endCoords.letterCoord - startCoords.letterCoord

  if (Math.abs(deltaNumberCoord) !== Math.abs(deltaLetterCoord)) {
    return false;
  } else {
    return isAttackingFieldLongMove(boardState, startCoords, endCoords, Math.sign(deltaNumberCoord), Math.sign(deltaLetterCoord))
  }
}


export function  isAttakingFieldVertical(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  if (endCoords.letterCoord !== startCoords.letterCoord) {
    return false;
  } else {
    return isAttackingFieldLongMove(boardState, startCoords, endCoords, Math.sign(endCoords.numberCoord - startCoords.numberCoord), 0)
  }
}


export function isAttakingFieldHorizontal(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  if (endCoords.numberCoord !== startCoords.numberCoord) {
    return false;
  } else {
    return isAttackingFieldLongMove(boardState, startCoords, endCoords, 0, Math.sign(endCoords.letterCoord - startCoords.letterCoord))
  }
}


function isAttackingFieldLongMove(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, i: number, j: number): boolean {
  let newNumberCoord: number;
  let newLetterCoord: number;

  let k: number = 1

  while (true) {
    newNumberCoord = startCoords.numberCoord + i * k;
    newLetterCoord = startCoords.letterCoord + j * k;

    if (newNumberCoord === endCoords.numberCoord && newLetterCoord === endCoords.letterCoord) {
      return true;
    }

    if (boardState[newNumberCoord][newLetterCoord] !== null && (boardState[newNumberCoord][newLetterCoord] as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
      return false;
    }

    k++;
  }
}


export function changeBoardStateOneMove(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): void {
  boardState[endCoords.numberCoord][endCoords.letterCoord] = boardState[startCoords.numberCoord][startCoords.letterCoord];
  boardState[startCoords.numberCoord][startCoords.letterCoord] = null;
}


export function isCoordPossible(coord: number): boolean {
  if (coord >= 0 && coord < boardLength) {
    return true;
  } else {
    return false;
  }
}

export function areCoordsPossible(coords: IChessCoords): boolean {
  return isCoordPossible(coords.numberCoord) && isCoordPossible(coords.letterCoord);
}

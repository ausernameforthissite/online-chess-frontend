import CHESS_MATCH from "../images/ImagesConstants";
import { BoardState } from "../models/chess-game/BoardState";
import { boardLength, ChessColor, getInvertedColor, IChessCoords, PieceViewStatus } from "../models/chess-game/ChessCommon";
import { changeBoardStateOneMove, IChessPiece } from "../models/chess-game/exports";
import { BoardCellEntityEnum, IBoardCellEntity } from "../models/chess-game/IBoardCellEntity";
import { IChessMoveFullData } from "../models/chess-game/IChessMove";


export function getChessPieceImagePath(chessPiece: IChessPiece): string {
  const color = chessPiece.color === ChessColor.white ? CHESS_MATCH.pieces.white : CHESS_MATCH.pieces.black

  switch (chessPiece.type) {
    case BoardCellEntityEnum.bishop:
      return color.bishop;
    case BoardCellEntityEnum.king:
      return color.king
    case BoardCellEntityEnum.knight:
      return color.knight
    case BoardCellEntityEnum.pawn:
      return color.pawn
    case BoardCellEntityEnum.queen:
      return color.queen
    case BoardCellEntityEnum.rook:
      return color.rook
    default:
      throw new Error("Wrong chess piece type");
  }
}


export function deleteSelectionFromBoardState(boardState: BoardState): void {
  for (let i: number = 0; i <  boardState.length; i++) {
    for (let j: number = 0; j <  boardState[i].length; j++) {
      if (boardState[i][j] !== null) {

        if ((<IBoardCellEntity>boardState[i][j]).type === BoardCellEntityEnum.boardCell) {
          boardState[i][j] = null;
        } else if ((<IChessPiece>boardState[i][j]).viewStatus !== PieceViewStatus.default) {
          (<IChessPiece>boardState[i][j]).viewStatus = PieceViewStatus.default;
        }
      }
    }
  }
}

export const makeChessMoveForward = (boardState: BoardState, enPassantPawnCoords: IChessCoords | null, chessMove: IChessMoveFullData): void => {
  const startPiece: IChessPiece = <IChessPiece>boardState[chessMove.startCoords.numberCoord][chessMove.startCoords.letterCoord];
      
  if (startPiece.firstMove) {
    startPiece.firstMove = false;
  }

  enPassantPawnCoords = null;

  changeBoardStateOneMove(boardState, chessMove.startCoords, chessMove.endCoords);

  if (chessMove.castling) {
    const rookInitialLetterCoord: number = chessMove.castling < 0 ? 0 : boardLength - 1;
    changeBoardStateOneMove(boardState, {numberCoord: chessMove.endCoords.numberCoord, letterCoord: rookInitialLetterCoord},
                          {numberCoord: chessMove.endCoords.numberCoord, letterCoord: chessMove.endCoords.letterCoord - chessMove.castling});
    (<IChessPiece>boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord - chessMove.castling]).firstMove = false;
    return;
  }


  if (chessMove.startPiece === BoardCellEntityEnum.pawn) {

    if (chessMove.endPiece === null && chessMove.startCoords.letterCoord !== chessMove.endCoords.letterCoord) {
      boardState[chessMove.startCoords.numberCoord][chessMove.endCoords.letterCoord] = null;
    } else if (Math.abs(chessMove.startCoords.numberCoord - chessMove.endCoords.numberCoord) === 2) {
      enPassantPawnCoords = chessMove.endCoords;
    }

    if (chessMove.pawnPromotionPiece) {
      boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] = {type: chessMove.pawnPromotionPiece, color: startPiece.color} as IChessPiece;
      if (chessMove.pawnPromotionPiece === BoardCellEntityEnum.rook) {
        (boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] as IChessPiece).firstMove = false
      }
    }
  }
}




export const makeChessMoveBackward = (boardState: BoardState, enPassantPawnCoords: IChessCoords | null, chessMove: IChessMoveFullData): void => {

  enPassantPawnCoords = chessMove.previousEnPassantCoords;

  if (chessMove.castling) {
    const rookInitialLetterCoord: number = chessMove.castling < 0 ? 0 : boardLength - 1;
    changeBoardStateOneMove(boardState, {numberCoord: chessMove.endCoords.numberCoord, letterCoord: chessMove.endCoords.letterCoord - chessMove.castling},
                            {numberCoord: chessMove.endCoords.numberCoord, letterCoord: rookInitialLetterCoord});
    (boardState[chessMove.endCoords.numberCoord][rookInitialLetterCoord] as IChessPiece).firstMove = true;

    changeBoardStateOneMove(boardState, chessMove.endCoords, chessMove.startCoords);
    (boardState[chessMove.startCoords.numberCoord][chessMove.startCoords.letterCoord] as IChessPiece).firstMove = true;
    return;
  } 

  let startPiece: IChessPiece = <IChessPiece>boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord];

  if (chessMove.pawnPromotionPiece) {
    startPiece = {type: BoardCellEntityEnum.pawn, color: startPiece.color}
  }

  if (chessMove.startPieceFirstMove) {
    startPiece.firstMove = true
  }

  boardState[chessMove.startCoords.numberCoord][chessMove.startCoords.letterCoord] = startPiece;
  
  let endPiece: IChessPiece | null = null;

  if (chessMove.endPiece) {
    endPiece = {type: chessMove.endPiece, color: getInvertedColor(startPiece.color)} as IChessPiece

    if (chessMove.endPieceFirstMove) {
      endPiece.firstMove = chessMove.endPieceFirstMove
    } else if (chessMove.endPiece === BoardCellEntityEnum.pawn || chessMove.endPiece === BoardCellEntityEnum.rook) {
      endPiece.firstMove = false;
    }
  } else if (chessMove.startPiece === BoardCellEntityEnum.pawn && chessMove.endPiece === null && chessMove.startCoords.letterCoord !== chessMove.endCoords.letterCoord) {
    boardState[chessMove.startCoords.numberCoord][chessMove.endCoords.letterCoord] = {type: BoardCellEntityEnum.pawn, color: getInvertedColor(startPiece.color), firstMove: false} as IChessPiece;
  }

  boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] = endPiece;
}


var deepEqual = require('deep-equal')

export function updateBoardState(boardState: BoardState, newBoardState: BoardState) {
  for (let i: number = 0; i < boardLength; i++) {
    for (let j: number = 0; j < boardLength; j++) {
      if (!deepEqual(boardState[i][j], newBoardState[i][j])) {
        boardState[i][j] = newBoardState[i][j];
      }
    }
  }
}

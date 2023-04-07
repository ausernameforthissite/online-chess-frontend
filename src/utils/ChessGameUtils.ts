import IMAGE_PATHS from "../images/ImagesConstants";
import { BoardState } from "../models/chess-game/BoardState";
import { boardLength, ChessColor, getInvertedColor, IChessCoords, PieceViewStatus } from "../models/chess-game/ChessCommon";
import { changeBoardStateOneMove, IChessPiece } from "../models/chess-game/exports";
import { BoardCellEntityEnum, IBoardCellEntity } from "../models/chess-game/IBoardCellEntity";
import { IChessMatchResult } from "../models/chess-game/IChessMatchResult";
import { IChessMoveFullData } from "../models/chess-game/IChessMove";


export function getChessPieceImagePath(chessPiece: IChessPiece): string {
  const color = chessPiece.color === ChessColor.white ? IMAGE_PATHS.pieces.white : IMAGE_PATHS.pieces.black

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
  for (let i: number = 0; i < boardState.length; i++) {
    for (let j: number = 0; j < boardState[i].length; j++) {
      if (boardState[i][j] !== null) {

        if ((boardState[i][j] as IBoardCellEntity).type === BoardCellEntityEnum.boardCell) {
          boardState[i][j] = null;
        } else if ((boardState[i][j] as IChessPiece).viewStatus !== PieceViewStatus.default) {
          (boardState[i][j] as IChessPiece).viewStatus = PieceViewStatus.default;
        }
      }
    }
  }
}

export const makeChessMoveForward = (boardState: BoardState, chessMove: IChessMoveFullData): (IChessCoords | null) => {
  const startPiece: IChessPiece = boardState[chessMove.startCoords.numberCoord][chessMove.startCoords.letterCoord] as IChessPiece;
      
  if (startPiece.firstMove) {
    startPiece.firstMove = false;
  }

  changeBoardStateOneMove(boardState, chessMove.startCoords, chessMove.endCoords);

  if (chessMove.castling) {
    const rookInitialLetterCoord: number = chessMove.castling < 0 ? 0 : boardLength - 1;
    changeBoardStateOneMove(boardState, {numberCoord: chessMove.endCoords.numberCoord, letterCoord: rookInitialLetterCoord},
                          {numberCoord: chessMove.endCoords.numberCoord, letterCoord: chessMove.endCoords.letterCoord - chessMove.castling});
    (boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord - chessMove.castling] as IChessPiece).firstMove = false;
    return null;
  }


  if (chessMove.startPiece === BoardCellEntityEnum.pawn) {

    if (chessMove.endPiece === null && chessMove.startCoords.letterCoord !== chessMove.endCoords.letterCoord) {
      boardState[chessMove.startCoords.numberCoord][chessMove.endCoords.letterCoord] = null;
    } else if (Math.abs(chessMove.startCoords.numberCoord - chessMove.endCoords.numberCoord) === 2) {
      return chessMove.endCoords;
    }

    if (chessMove.pawnPromotionPiece) {
      boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] = {type: chessMove.pawnPromotionPiece, color: startPiece.color} as IChessPiece;
      if (chessMove.pawnPromotionPiece === BoardCellEntityEnum.rook) {
        (boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] as IChessPiece).firstMove = false
      }
    }
  }

  return null;
}


export const makeChessMoveBackward = (boardState: BoardState, chessMove: IChessMoveFullData): (IChessCoords | null) => {

  let enPassantPawnCoords: IChessCoords | null = chessMove.previousEnPassantCoords;

  if (chessMove.castling) {
    const rookInitialLetterCoord: number = chessMove.castling < 0 ? 0 : boardLength - 1;
    changeBoardStateOneMove(boardState, {numberCoord: chessMove.endCoords.numberCoord, letterCoord: chessMove.endCoords.letterCoord - chessMove.castling},
                            {numberCoord: chessMove.endCoords.numberCoord, letterCoord: rookInitialLetterCoord});
    (boardState[chessMove.endCoords.numberCoord][rookInitialLetterCoord] as IChessPiece).firstMove = true;

    changeBoardStateOneMove(boardState, chessMove.endCoords, chessMove.startCoords);
    (boardState[chessMove.startCoords.numberCoord][chessMove.startCoords.letterCoord] as IChessPiece).firstMove = true;
    return enPassantPawnCoords;
  } 

  let startPiece: IChessPiece = boardState[chessMove.endCoords.numberCoord][chessMove.endCoords.letterCoord] as IChessPiece;

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

  return enPassantPawnCoords;
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

export function doesChessPieceTypeHaveFirstMoveField(chessPieceType: BoardCellEntityEnum) {
  return chessPieceType === BoardCellEntityEnum.king || chessPieceType === BoardCellEntityEnum.pawn || chessPieceType === BoardCellEntityEnum.rook;
}

export function getDefaultBoardState(): BoardState {
  const boardState: BoardState = new Array(boardLength);
  for (let i: number = 0; i < boardLength; i++) {
    boardState[i] = new Array(boardLength);
    if (i >= 2 && i <= 6) {
      for (let j: number = 0; j < boardLength; j ++) {
        boardState[i][j] = null;
      }
    }
  }
  

  for (let i: number = 0; i < 8; i++) {
    boardState[1][i] = {type: BoardCellEntityEnum.pawn, color: ChessColor.white, firstMove: true} as IChessPiece;
    boardState[6][i] = {type: BoardCellEntityEnum.pawn, color: ChessColor.black, firstMove: true} as IChessPiece;
  }

  boardState[0][0] = {type: BoardCellEntityEnum.rook, color: ChessColor.white, firstMove: true} as IChessPiece;
  boardState[0][1] = {type: BoardCellEntityEnum.knight, color: ChessColor.white} as IChessPiece;
  boardState[0][2] = {type: BoardCellEntityEnum.bishop, color: ChessColor.white} as IChessPiece;
  boardState[0][3] = {type: BoardCellEntityEnum.queen, color: ChessColor.white} as IChessPiece;
  boardState[0][4] = {type: BoardCellEntityEnum.king, color: ChessColor.white, firstMove: true} as IChessPiece;
  boardState[0][5] = {type: BoardCellEntityEnum.bishop, color: ChessColor.white} as IChessPiece;
  boardState[0][6] = {type: BoardCellEntityEnum.knight, color: ChessColor.white} as IChessPiece;
  boardState[0][7] = {type: BoardCellEntityEnum.rook, color: ChessColor.white, firstMove: true} as IChessPiece;

  boardState[7][0] = {type: BoardCellEntityEnum.rook, color: ChessColor.black, firstMove: true} as IChessPiece;
  boardState[7][1] = {type: BoardCellEntityEnum.knight, color: ChessColor.black} as IChessPiece;
  boardState[7][2] = {type: BoardCellEntityEnum.bishop, color: ChessColor.black} as IChessPiece;
  boardState[7][3] = {type: BoardCellEntityEnum.queen, color: ChessColor.black} as IChessPiece;
  boardState[7][4] = {type: BoardCellEntityEnum.king, color: ChessColor.black, firstMove: true} as IChessPiece;
  boardState[7][5] = {type: BoardCellEntityEnum.bishop, color: ChessColor.black} as IChessPiece;
  boardState[7][6] = {type: BoardCellEntityEnum.knight, color: ChessColor.black} as IChessPiece;
  boardState[7][7] = {type: BoardCellEntityEnum.rook, color: ChessColor.black, firstMove: true} as IChessPiece;


  return boardState;
}


export function getMatchResultString(matchResult: IChessMatchResult): string {
  if (matchResult.technicalFinish) {
    return "Техническое завершение игры";
  } else if (matchResult.draw) {
    return "Ничья";
  } else if (matchResult.winnerColor === ChessColor.white) {
    return "Победа белых";
  } else {
    return "Победа чёрных";
  }
}
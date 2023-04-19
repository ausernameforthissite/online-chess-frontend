import { SubscribeResponse } from "../DTO/match/ISubscribeResponse";
import { IWebsocketSendMessage } from "../DTO/match/websocket/IWebsocketSendMessage";
import { IChessCoords } from "./ChessCommon";
import { BoardCellEntityEnum } from "./IBoardCellEntity";

export enum ChessMoveResult {
  check = "CHECK",
  mate = "MATE"
}


export interface IChessMove extends IWebsocketSendMessage {
  moveNumber: number
  startPiece: BoardCellEntityEnum
  startCoords: IChessCoords
  endPiece: BoardCellEntityEnum | null
  endCoords: IChessCoords
  castling?: number
  pawnPromotionPiece?: BoardCellEntityEnum
}

export interface IChessMoveFullData extends IChessMove, SubscribeResponse {
  result?: ChessMoveResult
  startPieceFirstMove: boolean
  endPieceFirstMove: boolean
  previousEnPassantCoords: IChessCoords | null

  whiteTimeLeftMS: number
  blackTimeLeftMS: number
}

export function chessMoveToChessMoveFullData(chessMove: IChessMove, startPieceFirstMove: boolean,
                                             endPieceFirstMove: boolean, previousEnPassantCoords: IChessCoords | null,
                                             whiteTimeLeftMS: number, blackTimeLeftMS: number, result?: ChessMoveResult): IChessMoveFullData  {
    console.log(previousEnPassantCoords)
   return { moveNumber: chessMove.moveNumber,
            startPiece: chessMove.startPiece,
            startCoords: chessMove.startCoords,
            endPiece: chessMove.endPiece,
            endCoords: chessMove.endCoords,
            castling: chessMove.castling,
            pawnPromotionPiece: chessMove.pawnPromotionPiece,
            result: result,
            startPieceFirstMove: startPieceFirstMove,
            endPieceFirstMove: endPieceFirstMove,
            previousEnPassantCoords: previousEnPassantCoords,
            whiteTimeLeftMS: whiteTimeLeftMS,
            blackTimeLeftMS: blackTimeLeftMS
   } as IChessMoveFullData;
}

export function chessMoveToString(chessMove: IChessMoveFullData): string {
  let chessMoveString: string = "";

  
  if (chessMove.castling === 1) {
    chessMoveString += "0-0";
  } else if (chessMove.castling === -1) {
    chessMoveString += "0-0-0";
  } else {

    chessMoveString += chessPiecePostionToString(chessMove.startPiece, chessMove.startCoords);

    if (chessMove.endPiece || (chessMove.startPiece === BoardCellEntityEnum.pawn && chessMove.startCoords.letterCoord !== chessMove.endCoords.letterCoord)) {
      chessMoveString += "x"
    } else {
      chessMoveString += "—"
    }

    chessMoveString += chessPiecePostionToString(chessMove.endPiece, chessMove.endCoords);
  }

  if (chessMove.pawnPromotionPiece) {
    chessMoveString += "=" + chessPieceToNotationLetter(chessMove.pawnPromotionPiece);
  }


  switch(chessMove.result) {
    case ChessMoveResult.check:
      chessMoveString += "+";
      break;
    case ChessMoveResult.mate:
      chessMoveString += "#";
      break;
  }

  return chessMoveString;
  
}

function chessPieceToNotationLetter(chessPiece: BoardCellEntityEnum | null): string {
  switch(chessPiece) {
    case BoardCellEntityEnum.bishop:
      return "B";
    case BoardCellEntityEnum.king:
      return "K";
    case BoardCellEntityEnum.knight:
      return "N";
    case BoardCellEntityEnum.rook:
      return "R";
    case BoardCellEntityEnum.queen:
      return "Q";
    default:
      return "";
  }
}

function chessPiecePostionToString(chessPiece: BoardCellEntityEnum | null, coords: IChessCoords): string {
  let chessPiecePostionString = chessPieceToNotationLetter(chessPiece);
  chessPiecePostionString += String.fromCharCode(97 + coords.letterCoord) + coords.numberCoord
  return chessPiecePostionString;
}
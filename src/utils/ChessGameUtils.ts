import CHESS_MATCH from "../images/ImagesConstants";
import { Bishop } from "../models/chess-game/chess-pieces/Bishop";
import { Knight } from "../models/chess-game/chess-pieces/Knight";
import { Pawn } from "../models/chess-game/chess-pieces/Pawn";
import { Queen } from "../models/chess-game/chess-pieces/Queen";
import { Rook } from "../models/chess-game/chess-pieces/Rook";
import { ChessColor } from "../models/chess-game/ChessCommon";
import { ChessPiece, King } from "../models/chess-game/exports";

export function getChessPieceImagePath(chessPiece: ChessPiece): string {
  const color = chessPiece.color === ChessColor.white ? CHESS_MATCH.pieces.white : CHESS_MATCH.pieces.black

  if (chessPiece instanceof Bishop) {
    return color.bishop;
  } else if (chessPiece instanceof King) {
    return color.king;
  } else if (chessPiece instanceof Knight) {
    return color.knight;
  } else if (chessPiece instanceof Pawn) {
    return color.pawn;
  } else if (chessPiece instanceof Queen) {
    return color.queen;
  } else if (chessPiece instanceof Rook) {
    return color.rook;
  } 

  throw new Error("Chess piece image is not found");
}

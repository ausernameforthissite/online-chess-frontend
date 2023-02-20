import { BoardState } from "../BoardState";
import { IChessCoords, PieceViewStatus } from "../ChessCommon";
import { IChessPiece, CheckGoDiagonal, CheckGoHorizontal, CheckGoVertical, isAttakingFieldDiagonal, isAttakingFieldVertical, isAttakingFieldHorizontal, findKingCoords } from "../exports";



export function findPossibleMovesQueen(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {

    currentPiece.viewStatus = PieceViewStatus.selected
    const kingCoords: IChessCoords = <IChessCoords>findKingCoords(boardState, currentPiece.color);

    CheckGoDiagonal(boardState, startCoords, kingCoords, currentPiece.color);
    CheckGoHorizontal(boardState, startCoords, kingCoords, currentPiece.color);
    CheckGoVertical(boardState, startCoords, kingCoords, currentPiece.color);
  }


export function isAttakingFieldQueen(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

  return  isAttakingFieldDiagonal(boardState, startCoords, endCoords) ||
          isAttakingFieldVertical(boardState, startCoords, endCoords) ||
          isAttakingFieldHorizontal(boardState, startCoords, endCoords);
}
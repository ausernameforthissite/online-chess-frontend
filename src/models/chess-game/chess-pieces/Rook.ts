import { BoardState } from "../BoardState";
import { IChessCoords, PieceViewStatus } from "../ChessCommon";
import { CheckGoHorizontal, CheckGoVertical, findKingCoords, IChessPiece, isAttakingFieldHorizontal, isAttakingFieldVertical } from "../exports";




export function findPossibleMovesRook(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {

  currentPiece.viewStatus = PieceViewStatus.selected
  const kingCoords: IChessCoords = <IChessCoords>findKingCoords(boardState, currentPiece.color);

  CheckGoVertical(boardState, startCoords, kingCoords, currentPiece.color)
  CheckGoHorizontal(boardState, startCoords, kingCoords, currentPiece.color)
}


export function isAttakingFieldRook(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

  return  isAttakingFieldVertical(boardState, startCoords, endCoords) ||
          isAttakingFieldHorizontal(boardState, startCoords, endCoords);
}
  

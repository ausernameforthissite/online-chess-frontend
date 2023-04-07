import { BoardState } from "../BoardState";
import { IChessCoords, PieceViewStatus } from "../ChessCommon";
import { CheckGoDiagonal, findKingCoords, IChessPiece, isAttakingFieldDiagonal} from "../exports";




export function findPossibleMovesBishop(currentPiece: IChessPiece, boardState: BoardState, startCoords: IChessCoords): void {

  currentPiece.viewStatus = PieceViewStatus.selected;
  const kingCoords: IChessCoords = findKingCoords(boardState, currentPiece.color) as IChessCoords;
  CheckGoDiagonal(boardState, startCoords, kingCoords, currentPiece.color);

}


export function isAttakingFieldBishop(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
  return isAttakingFieldDiagonal(boardState, startCoords, endCoords);
}
  

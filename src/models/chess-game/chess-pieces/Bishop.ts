import _ from "lodash";
import { BoardState } from "../BoardState";
import { ChessColor, ChessPieceEnum, IChessCoords } from "../ChessCommon";
import { ChessPiece, PieceViewStatus } from "../exports";
import { IMatch } from "../IMatch";



export class Bishop extends ChessPiece {

  public type: ChessPieceEnum.bishop

  constructor(color: ChessColor) {
    super(color)
  }

  public findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void {

    this.viewStatus = PieceViewStatus.selected;
    const kingCoords: IChessCoords = <IChessCoords> ChessPiece.findKingCoords(boardState, this.color);
    ChessPiece.CheckGoDiagonal(boardState, startCoords, kingCoords, this.color);
  }


  public isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
    return ChessPiece.isAttakingFieldDiagonal(boardState, startCoords, endCoords);
  }
  
}
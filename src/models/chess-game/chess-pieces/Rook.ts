import _ from "lodash";
import { BoardState } from "../BoardState";
import { ChessColor, ChessPieceEnum, IChessCoords } from "../ChessCommon";
import { ChessPiece, PieceViewStatus } from "../exports";
import { IMatch } from "../IMatch";



export class Rook extends ChessPiece {

  public firstMove: boolean
  public type: ChessPieceEnum.rook

  constructor(color: ChessColor, firstMove: boolean) {
    super(color)
    this.firstMove = firstMove
  }


  public findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void {

    this.viewStatus = PieceViewStatus.selected
    const kingCoords: IChessCoords = <IChessCoords>ChessPiece.findKingCoords(boardState, this.color);

    ChessPiece.CheckGoVertical(boardState, startCoords, kingCoords, this.color)
    ChessPiece.CheckGoHorizontal(boardState, startCoords, kingCoords, this.color)
  }


  public isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

    return  ChessPiece.isAttakingFieldVertical(boardState, startCoords, endCoords) ||
            ChessPiece.isAttakingFieldHorizontal(boardState, startCoords, endCoords);
  }
  
}
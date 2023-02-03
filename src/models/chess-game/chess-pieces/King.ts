import _ from "lodash";
import { BoardState } from "../BoardState";
import { boardLength, ChessColor, ChessPieceEnum, IChessCoords } from "../ChessCommon";
import { ChessPiece, PieceViewStatus } from "../exports";
import { IMatch } from "../IMatch";
import { PossibleMoveCell } from "../PossibleMoveCell";
import { Rook } from "./Rook";


export class King extends ChessPiece {

  public firstMove: boolean
  public check: boolean
  public type: ChessPieceEnum.king

  constructor(color: ChessColor, firstMove: boolean, check: boolean) {
    super(color)
    this.firstMove = firstMove
    this.check = check
  }

  public findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void {

    this.viewStatus = PieceViewStatus.selected
    let newCoords: IChessCoords;

    for (let i: number = -1; i <= 1; i++) {
      
      for (let j: number = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }

        newCoords = {numberCoord: startCoords.numberCoord + i, letterCoord: startCoords.letterCoord + j}
        ChessPiece.checkGoOrCapture(boardState, startCoords, newCoords, startCoords, this.color);
      }

    }

    this.checkCastling(boardState, startCoords)
  }


  private checkCastling(boardState: BoardState, startCoords: IChessCoords): void {
    if (this.firstMove === true && !this.check) {

      outerLoop:
      for (let i: number = -1; i <= 1; i += 2) {
        const rookInitialLetterCoord = i < 0 ? 0 : boardLength - 1;

        if (boardState[startCoords.numberCoord][rookInitialLetterCoord] instanceof Rook) {

          const myRook = <Rook>boardState[startCoords.numberCoord][rookInitialLetterCoord]

          if (myRook.color === this.color && myRook.firstMove === true) {

            let j = startCoords.letterCoord;


            while (j != rookInitialLetterCoord - i) {
              j += i;
              if (boardState[startCoords.numberCoord][j] instanceof ChessPiece) {
                continue outerLoop;
              }

            }

            j = startCoords.letterCoord;
            let endLetterCoord = startCoords.letterCoord + i * 2;

            while (j != endLetterCoord) {
              j += i;
              if (ChessPiece.isUnderAttack(boardState, { numberCoord: startCoords.numberCoord, letterCoord: j}, this.color)) {
                continue outerLoop;
              }
            }

            boardState[startCoords.numberCoord][endLetterCoord] = new PossibleMoveCell();
          }
        }
      }
    }
  }

  protected isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
    return Math.abs(endCoords.numberCoord - startCoords.numberCoord) <= 1
            && Math.abs(endCoords.letterCoord - startCoords.letterCoord) <= 1;
  }

}
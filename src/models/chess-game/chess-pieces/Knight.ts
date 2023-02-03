import _ from "lodash";
import { BoardState } from "../BoardState";
import { ChessColor, ChessPieceEnum, IChessCoords } from "../ChessCommon";
import { ChessPiece, PieceViewStatus } from "../exports";
import { IMatch } from "../IMatch";


export class Knight extends ChessPiece {

  public type: ChessPieceEnum.knight

  constructor(color: ChessColor) {
    super(color)
  }

  public findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void {

    this.viewStatus = PieceViewStatus.selected;
    const kingCoords: IChessCoords = <IChessCoords> ChessPiece.findKingCoords(boardState, this.color);


    let newLetterCoord;
    let newNumberCoord;

    for(let i: number = -2; i <= 2; i++) {
      if (i === 0) {
        continue;
      }
      newNumberCoord = startCoords.numberCoord + i;

      if (ChessPiece.isCoordPossible(newNumberCoord)) {

        for(let k: number = -1; k <= 1; k += 2) {
          newLetterCoord = startCoords.letterCoord + k * (3 - Math.abs(i))
          ChessPiece.checkGoOrCapture(boardState, startCoords, {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords, this.color);
        }

      }

    }
  }


  public isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
    let newLetterCoord;
    let newNumberCoord;

    for(let i: number = -2; i <= 2; i++) {
      if (i === 0) {
        continue;
      }

      newNumberCoord = startCoords.numberCoord + i;

      if (newNumberCoord === endCoords.numberCoord) {
        for(let k: number = -1; k <= 1; k += 2) {
          newLetterCoord = startCoords.letterCoord + k * (3 - Math.abs(i))

          if (newLetterCoord === endCoords.letterCoord) {
            return true;
          }
        }
      } 
    }

    return false;
  }
  
}
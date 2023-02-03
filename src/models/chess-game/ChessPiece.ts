import { boardLength, ChessColor, IChessCoords } from "./ChessCommon";
import { BoardState } from "./BoardState";
import { King } from "./exports";
import _ from "lodash";
import { PossibleMoveCell } from "./PossibleMoveCell";
import { IMatch } from "./IMatch";


export enum PieceViewStatus { notSelected, selected, underAttack };


export abstract class ChessPiece {
  public viewStatus?: PieceViewStatus;
  public color: ChessColor;

  constructor(color: ChessColor) {
    this.color = color
  }

  public abstract findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void;

  protected abstract isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean;

// +
  protected static isUnderAttack(boardState: BoardState, endCoords: IChessCoords, myColor: ChessColor): boolean {
    for (let i: number = 0; i < boardLength; i++) {
      for(let j: number = 0; j < boardLength; j++) {
        if (boardState[i][j] instanceof ChessPiece) {
          const chessPiece : ChessPiece = <ChessPiece>boardState[i][j]

          if (chessPiece.color != myColor && chessPiece.isAttakingField(boardState, {numberCoord: i, letterCoord: j}, endCoords)) {
            return true;
          }

        }
      }
    }

    return false;
  }

// +
  protected static findKingCoords(boardState: BoardState, kingColor: ChessColor): IChessCoords {

    for (let i: number = 0; i < boardLength; i++) {
      for(let j: number = 0; j < boardLength; j++) {
        if (boardState[i][j] instanceof King && (<King>boardState[i][j]).color === kingColor) {
          return {numberCoord: i, letterCoord: j} ;
        }
      }
    }
    throw new Error("King was not found");
  }

// +
  protected static CheckGoDiagonal(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
    let newNumberCoord: number;
    let newLetterCoord: number;


    for (let i: number = -1; i <= 1; i += 2) {
      for (let j: number = -1; j <= 1; j += 2) {
        let k = 1;

        while (true) {
          newNumberCoord = startCoords.numberCoord + i * k;
          newLetterCoord = startCoords.letterCoord + j * k;

          if (!ChessPiece.checkGoOrCapture(boardState, startCoords, { numberCoord: newNumberCoord, letterCoord: newLetterCoord}, kingCoords, startPieceColor)) {
            break;
          }
      
          k++;
        }

      }
    }
  }

// +
  protected static CheckGoVertical(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
    let newNumberCoord;

    for (let i: number = -1; i <= 1; i += 2) {
      let k = 1;

      while (true) {
        newNumberCoord = startCoords.numberCoord + i * k;

        if (!ChessPiece.checkGoOrCapture(boardState, startCoords, { numberCoord: newNumberCoord, letterCoord: startCoords.letterCoord }, kingCoords, startPieceColor)) {
          break;
        }
    
        k++;
      }
    
    }
  }

// +
  protected static CheckGoHorizontal(boardState: BoardState, startCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor) : void {
    let newLetterCoord;

    for (let j: number = -1; j <= 1; j += 2) {
      let k = 1;

      while (true) {
        newLetterCoord = startCoords.letterCoord + j * k;

        if (!this.checkGoOrCapture(boardState, startCoords, { numberCoord: startCoords.numberCoord, letterCoord: newLetterCoord }, kingCoords, startPieceColor)) {
          break;
        }
    
        k++;
      }
    
    }
  }

// +
  protected static checkGoOrCapture(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords, startPieceColor: ChessColor): boolean {
    if (!ChessPiece.areCoordsPossible(endCoords)) {
      return false;
    }

    if (!(boardState[endCoords.numberCoord][endCoords.letterCoord] instanceof ChessPiece)) {
      if (!ChessPiece.willBeCheck(boardState, startCoords, endCoords, kingCoords, startPieceColor)) {
        boardState[endCoords.numberCoord][endCoords.letterCoord] = new PossibleMoveCell();
      }
      return true;
    }

    const endPiece: ChessPiece = <ChessPiece>boardState[endCoords.numberCoord][endCoords.letterCoord];

    if (endPiece.color != startPieceColor && !ChessPiece.willBeCheck(boardState, startCoords, endCoords, kingCoords, startPieceColor)) {
      endPiece.viewStatus = PieceViewStatus.underAttack;
    }

    return false;
  }

  // +
  protected static willBeCheck(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords,
                              kingCoords: IChessCoords, startPieceColor: ChessColor): boolean {
    const tempBoardState = _.cloneDeep(boardState);
    ChessPiece.changeBoardStateOneMove(tempBoardState, startCoords, endCoords);

    return ChessPiece.isUnderAttack(tempBoardState, kingCoords, startPieceColor);
  }

// +
  protected static isAttakingFieldDiagonal(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

    const deltaNumberCoord: number = endCoords.numberCoord - startCoords.numberCoord
    const deltaLetterCoord: number = endCoords.letterCoord - startCoords.letterCoord

    if (Math.abs(deltaNumberCoord) != Math.abs(deltaLetterCoord)) {
      return false;
    } else {
      return ChessPiece.isAttackingFieldLongMove(boardState, startCoords, endCoords, Math.sign(deltaNumberCoord), Math.sign(deltaLetterCoord))
    }
  }

// +
  protected static isAttakingFieldVertical(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
    if (endCoords.letterCoord != startCoords.letterCoord) {
      return false;
    } else {
      return ChessPiece.isAttackingFieldLongMove(boardState, startCoords, endCoords, Math.sign(endCoords.numberCoord - startCoords.numberCoord), 0)
    }
  }

// +
  protected static isAttakingFieldHorizontal(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {
    if (endCoords.numberCoord != startCoords.numberCoord) {
      return false;
    } else {
      return ChessPiece.isAttackingFieldLongMove(boardState, startCoords, endCoords, 0, Math.sign(endCoords.letterCoord - startCoords.letterCoord))
    }
  }

// +
  protected static isAttackingFieldLongMove(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, i: number, j: number): boolean {
    let newNumberCoord: number;
    let newLetterCoord: number;

    let k: number = 1

    while (true) {
      newNumberCoord = startCoords.numberCoord + i * k;
      newLetterCoord = startCoords.letterCoord + j * k;

      if (newNumberCoord === endCoords.numberCoord && newLetterCoord === endCoords.letterCoord) {
        return true;
      }

      if (boardState[newNumberCoord][newLetterCoord] != null) {
        return false;
      }

      k++;
    }
  }

// +
  protected static changeBoardStateOneMove(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): void {
    boardState[endCoords.numberCoord][endCoords.letterCoord] = boardState[startCoords.numberCoord][startCoords.letterCoord];
    boardState[startCoords.numberCoord][startCoords.letterCoord] = null;
}

// +
  protected static isCoordPossible(coord: number): boolean {
    if (coord >= 0 && coord < boardLength) {
      return true;
    } else {
      return false;
    }
  }

// +
  protected static areCoordsPossible(coords: IChessCoords): boolean {
    return ChessPiece.isCoordPossible(coords.numberCoord) && ChessPiece.isCoordPossible(coords.letterCoord);
  }

}

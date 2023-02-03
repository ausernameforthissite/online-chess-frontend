import { areCoordsEqual, ChessColor, ChessPieceEnum, IChessCoords } from "../ChessCommon";
import { ChessPiece, PieceViewStatus } from "../exports";
import { BoardState } from "../BoardState";
import _ from "lodash";
import { PossibleMoveCell } from "../PossibleMoveCell";
import { IMatch } from "../IMatch";


export class Pawn extends ChessPiece {

  public firstMove: boolean
  public type: ChessPieceEnum.pawn

  constructor(color: ChessColor, firstMove: boolean) {
    super(color)
    this.firstMove = firstMove
  }


  public findPossibleMoves({boardState, enPassantPawnCoords}: IMatch, startCoords: IChessCoords): void {

    this.viewStatus = PieceViewStatus.selected
    const kingCoords: IChessCoords = <IChessCoords>ChessPiece.findKingCoords(boardState, this.color);
    const direction: number = this.color === ChessColor.white ? +1 : -1;


    this.checkGoForward(boardState, direction, startCoords, kingCoords);
    this.checkCapture(boardState, enPassantPawnCoords, direction, startCoords, kingCoords);


  }


  private checkGoForward(boardState: BoardState, direction: number, startCoords: IChessCoords, kingCoords: IChessCoords): void {
    for (let i: number = 1; i <= (this.firstMove ? 2 : 1); i++) {
      let endNumberCoord = startCoords.numberCoord + i * direction;

      if (!(boardState[endNumberCoord][startCoords.letterCoord] instanceof ChessPiece)) {

        if (!ChessPiece.willBeCheck(boardState, startCoords, {numberCoord: endNumberCoord, letterCoord: startCoords.letterCoord}, kingCoords, this.color)) {
          boardState[endNumberCoord][startCoords.letterCoord] = new PossibleMoveCell();
        }

      } else {
        break;
      }
    }
  }


  private checkCapture(boardState: BoardState, enPassantPawnCoords: IChessCoords, direction: number, startCoords: IChessCoords, kingCoords: IChessCoords): void {
    for (let i: number = -1; i <= 1; i += 2) {

      const newLetterCoord = startCoords.letterCoord + i;
      const newNumberCoord = startCoords.numberCoord + direction;

      if (ChessPiece.isCoordPossible(newLetterCoord)) {
        if (boardState[newNumberCoord][newLetterCoord] instanceof ChessPiece) {
          this.checkNormalCapture(boardState,  {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, startCoords, kingCoords)
        } else {
          this.checkEnPassant(boardState, enPassantPawnCoords, {numberCoord: newNumberCoord, letterCoord: newLetterCoord}, startCoords, kingCoords)
        }
      }

    }
  }

  private checkNormalCapture(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords): void {
    const endPiece = <ChessPiece>boardState[endCoords.numberCoord][endCoords.letterCoord];

    if (endPiece.color != this.color && !ChessPiece.willBeCheck(boardState, startCoords, endCoords, kingCoords, this.color)) {
      endPiece.viewStatus = PieceViewStatus.underAttack;
    }
  }

  private checkEnPassant(boardState: BoardState, enPassantPawnCoords: IChessCoords, startCoords: IChessCoords, endCoords: IChessCoords, kingCoords: IChessCoords): void {

    if (areCoordsEqual(enPassantPawnCoords, {numberCoord: startCoords.numberCoord, letterCoord: endCoords.letterCoord}) &&
        boardState[startCoords.numberCoord][endCoords.letterCoord] instanceof Pawn) {

      const enemyPawn: Pawn = <Pawn>boardState[startCoords.numberCoord][endCoords.letterCoord];

      if (enemyPawn.color != this.color) {

        const tempBoardState= _.cloneDeep(boardState)
        tempBoardState[endCoords.numberCoord][endCoords.letterCoord] = this;
        tempBoardState[startCoords.numberCoord][endCoords.letterCoord] = null;
        tempBoardState[startCoords.numberCoord][startCoords.letterCoord] = null;
    
        if (!ChessPiece.isUnderAttack(tempBoardState, kingCoords, this.color)) {
          boardState[endCoords.numberCoord][endCoords.letterCoord] = new PossibleMoveCell();
        }

      }
    }

  }


  public isAttakingField(boardState: BoardState, startCoords: IChessCoords, endCoords: IChessCoords): boolean {

    const direction: number = this.color === ChessColor.white ? +1 : -1;

    if (startCoords.numberCoord + direction != endCoords.numberCoord) {
      return false;
    }

    if (startCoords.letterCoord - 1 === endCoords.letterCoord || startCoords.letterCoord + 1 === endCoords.letterCoord) {
      return true;
    } else {
      return false;
    }
  }
  
}
import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import BoardCell from "../../components/chess-match/board-cell/BoardCell"
import ChessBoard from "../../components/chess-match/chess-board/ChessBoard"
import LetterCoord from "../../components/chess-match/chess-coord/letter-coord/LetterCoord"
import NumberCoord from "../../components/chess-match/chess-coord/number-coord/NumberCoord"
import ChessPieceComponent from "../../components/chess-match/chess-piece/ChessPieceComponent"
import MatchInfo from "../../components/chess-match/match-info.tsx/MatchInfo"
import PawnPromotionModalWindow from "../../components/chess-match/pawn-promotion-modal-window/PawnPromotionModalWindow"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { BoardState } from "../../models/chess-game/BoardState"
import { IChessCoords, PieceViewStatus } from "../../models/chess-game/ChessCommon"
import { findPossibleMoves, IChessPiece} from "../../models/chess-game/exports"
import { BoardCellEntityEnum, IBoardCellEntity } from "../../models/chess-game/IBoardCellEntity"
import { IPossibleMoveCell } from "../../models/chess-game/IPossibleMoveCell"
import { getMatchStateAndSubscribeToMatch, getUsersRatingsData, sendChessMove } from "../../services/MatchService"
import { matchSlice } from "../../store/reducers/MatchReducer"
import { deleteSelectionFromBoardState } from "../../utils/ChessGameUtils"
import styles from './Match.module.css';



const Match: FC = () => {

  const location = useLocation();
  const matchData = useAppSelector(state => state.matchData)
  const match = matchData.match;
  const dispatch = useAppDispatch()
  const [pawnPromotionModalWindowCoords, setPawnPromotionModalWindowCoords] = useState({numberCoord: -1, letterCoord: -1} as IChessCoords);

  const letterCoordsArray: Array<string> = Array.from("abcdefgh");
  const numberCoordsArray: Array<string> = Array.from("12345678");

  useEffect(() => {
    const url = location.pathname;
    const matchId = Number(url.slice(url.lastIndexOf("/") + 1 ));

    if (Number.isNaN(matchId) || matchId < 0) {
      console.log("Wrong match id!");
    } else if (!match) {
      getMatchStateAndSubscribeToMatch(matchId);
      getUsersRatingsData(matchId);
    }

   }, [])

  
  function selectChessPiece(e: React.MouseEvent<any>, startCoords: IChessCoords): void {
    e.stopPropagation();
    e.preventDefault();

    if (match && !matchData.sendingChessMove) {
      if ((match.boardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece).viewStatus === PieceViewStatus.selected) {
        dispatch(matchSlice.actions.clearBoardState());
        return;
      }

      const newBoardState: BoardState = _.cloneDeep(match.boardState);
      if (matchData.pieceSelected) {
        deleteSelectionFromBoardState(newBoardState);
      }

      const newSelectedChessPiece: IChessPiece = newBoardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece;
      findPossibleMoves(newSelectedChessPiece, newBoardState, match.enPassantPawnCoords, startCoords)
      dispatch(matchSlice.actions.selectChessPiece({boardState: newBoardState, selectChessPieceStart: {startPiece: newSelectedChessPiece.type, startCoords: startCoords}}));

    } else {
      throw new Error("No match was found");
    }
  }


  function makeChessMove(e: React.MouseEvent<any>, endCoords: IChessCoords): void { 
    e.stopPropagation();
    e.preventDefault();

    if (match && !matchData.sendingChessMove) {
      const endPiece: IBoardCellEntity = match.boardState[endCoords.numberCoord][endCoords.letterCoord] as IBoardCellEntity;

      if (matchData.newMoveStart?.startPiece === BoardCellEntityEnum.pawn && (endCoords.numberCoord === 0 || endCoords.numberCoord === 7)) {
        setPawnPromotionModalWindowCoords(endCoords);
        return;
      }

      let castling: number | undefined;
      let endPieceType: BoardCellEntityEnum | null = null;

      if (endPiece.type !== BoardCellEntityEnum.boardCell) {
        endPieceType = endPiece.type;
      } else {
        castling = (endPiece as IPossibleMoveCell).castling;
      }
      
      sendChessMove({endPiece: endPieceType, endCoords: endCoords, castling: castling})
    } else {
      throw new Error("match was not found");
    }
  }


  return (
      <div>
        <h1>Match</h1>
        {match &&
          <div className={styles.matchContent}>
            <ChessBoard>
              {numberCoordsArray.map((coordName, i) => {
                  return (<NumberCoord key={String(i) + String(0)} playerColor={matchData.myColor} coordNumber={+i}>{coordName}</NumberCoord>)
                })
              }

              {letterCoordsArray.map((coordName, j) => {
                  return (<LetterCoord key={String(0) + String(j)} playerColor={matchData.myColor} coordNumber={+j}>{coordName}</LetterCoord>)
                })
              }

              {pawnPromotionModalWindowCoords.numberCoord >= 0 &&
                <PawnPromotionModalWindow playerColor={matchData.myColor} pieceCoords={pawnPromotionModalWindowCoords} setChessCoordsToChangeVisibility={setPawnPromotionModalWindowCoords}/>
              }
              
              {matchData.myTurn && matchData.viewedMoveNumber === matchData.lastMoveNumber ?
                match.boardState.map((row, i) => {
                  return (
                    row.map((cell, j) => {
                      if (cell != null) {
                        if ((cell as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
                          const chessPiece: IChessPiece = cell as IChessPiece;
    
                          if (chessPiece.color === matchData.myColor) {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={selectChessPiece}/>
                          } else if (chessPiece.viewStatus === PieceViewStatus.underAttack) {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={makeChessMove}/>
                          } else {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}}/>
                          }
                        } else {
                          return <BoardCell key={String(i) + String(j)} playerColor={matchData.myColor} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={makeChessMove}/>
                        }
                      }
                    }
                  ))
                })
              :
                match.boardState.map((row, i) => {
                  return (
                    row.map((cell, j) => {
                      if (cell != null) {
                        if ((cell as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
                          return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={cell as IChessPiece} pieceCoords={{numberCoord: i, letterCoord: j}}/>
                        }
                      }
                    }
                  ))
                })
              }
            </ChessBoard>
            <MatchInfo/>
          </div>
        }
      </div>
  )
}

export default Match
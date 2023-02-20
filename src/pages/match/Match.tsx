import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import BoardCell from "../../components/board-cell/BoardCell"
import ChessBoard from "../../components/chess-board/ChessBoard"
import ChessPieceComponent from "../../components/chess-piece/ChessPieceComponent"
import MatchInfo from "../../components/match-info.tsx/MatchInfo"
import PawnPromotionModalWindow from "../../components/pawn-promotion-modal-window/PawnPromotionModalWindow"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { BoardState } from "../../models/chess-game/BoardState"
import { IChessCoords, PieceViewStatus } from "../../models/chess-game/ChessCommon"
import { findPossibleMoves, IChessPiece} from "../../models/chess-game/exports"
import { BoardCellEntityEnum, IBoardCellEntity } from "../../models/chess-game/IBoardCellEntity"
import { IPossibleMoveCell } from "../../models/chess-game/IPossibleMoveCell"
import MatchService from "../../services/MatchService"
import { matchSlice } from "../../store/reducers/MatchReducer"
import { deleteSelectionFromBoardState } from "../../utils/ChessGameUtils"
import styles from './Match.module.css';



const Match: FC = () => {

  const location = useLocation();
  const matchData = useAppSelector(state => state.matchData)
  const match = matchData.match;
  const matchRecordString = matchData.matchRecordString;
  const dispatch = useAppDispatch()
  const [pawnPromotionModalWindowCoords, setPawnPromotionModalWindowCoords] = useState({numberCoord: -1, letterCoord: -1} as IChessCoords);


  useEffect(() => {
    const url = location.pathname;
    const matchId = Number(url.slice(url.lastIndexOf("/") + 1 ));

    if (Number.isNaN(matchId) || matchId < 0) {
      console.log("Wrong match id!");
    } else if (!match) {
      MatchService.getMatchState(matchId);
    } else if (matchId === matchData.matchId && matchData.activeMatch && !matchData.subscribed) {


      let interval = setInterval(() => {
        MatchService.subscribeToMatch();
      }, 15000);

      return () => {
        clearInterval(interval);
      };
  
    }
  }, [matchData.activeMatch])



  
  function selectChessPiece(e: React.MouseEvent<any>, startCoords: IChessCoords): void {
    e.stopPropagation();
    e.preventDefault();

    if (match && !matchData.sendingChessMove) {
      if ((match.boardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece).viewStatus === PieceViewStatus.selected) {
        dispatch(matchSlice.actions.resetBoardState());
        return;
      }

      const newBoardState: BoardState = _.cloneDeep(match.boardState);
      if (matchData.pieceSelected) {
        deleteSelectionFromBoardState(newBoardState);
      }

      const newChessPiece: IChessPiece = newBoardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece;
      findPossibleMoves(newChessPiece, newBoardState, match.enPassantPawnCoords, startCoords)
      dispatch(matchSlice.actions.selectChessPiece({boardState: newBoardState, selectChessPieceStart: {startPiece: newChessPiece.type, startCoords: startCoords}}));

    } else {
      throw new Error("match was not found");
    }
  }


  function makeChessMove(e: React.MouseEvent<any>, endCoords: IChessCoords): void { 
    e.stopPropagation();
    e.preventDefault();

    if (match && !matchData.sendingChessMove) {
      const endPiece: IBoardCellEntity = match.boardState[endCoords.numberCoord][endCoords.letterCoord] as IBoardCellEntity

      console.log(matchData.newMoveStart)
      console.log(endCoords.numberCoord)
      if (matchData.newMoveStart?.startPiece === BoardCellEntityEnum.pawn && (endCoords.numberCoord === 0 || endCoords.numberCoord === 7)) {
        console.log("modal window")
        setPawnPromotionModalWindowCoords(endCoords);
        return;
      }

      let castling: number | undefined
      let endPieceType: BoardCellEntityEnum | null = null;

      if (endPiece.type !== BoardCellEntityEnum.boardCell) {
        endPieceType = endPiece.type
      } else {
        castling = (endPiece as IPossibleMoveCell).castling
      }
      
      MatchService.sendChessMove({endPiece: endPieceType, endCoords: endCoords, castling: castling})
    } else {
      throw new Error("match was not found");
    }
  }


  return (
      <div>
        <h1>Match</h1>
        {match && matchRecordString &&
          <div className={styles.matchContent}>
            <ChessBoard playerColor={matchData.myColor}>
              {pawnPromotionModalWindowCoords.numberCoord >= 0 && <PawnPromotionModalWindow playerColor={matchData.myColor} pieceCoords={pawnPromotionModalWindowCoords} setChessCoordsToChangeVisibility={setPawnPromotionModalWindowCoords}/>}
              {(matchData.myTurn && matchData.viewedMove === matchRecordString.length - 1) ?
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
                          return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} />
                        }
                      } else {
                        return <BoardCell key={String(i) + String(j)} playerColor={matchData.myColor} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={makeChessMove}/>
                      }
                    }
                  }
                ))
              }) :
              match.boardState.map((row, i) => {
                return (
                  row.map((cell, j) => {
                    if (cell != null) {
                      if ((cell as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
                        return <ChessPieceComponent key={String(i) + String(j)} playerColor={matchData.myColor} chessPiece={cell as IChessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} />
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
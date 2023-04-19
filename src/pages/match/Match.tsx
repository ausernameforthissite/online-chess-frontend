import { CompatClient } from "@stomp/stompjs"
import _ from "lodash"
import React, { FC, Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { getWebsocetSendEndpoint } from "../../api/Endpoints"
import { WebsocketClientsHolder } from "../../api/WebsocketClientsHolder"
import { WebsocketConnectionEnum } from "../../api/websocketFunctions/WebsocketFunctions"
import BoardCell from "../../components/chess-match/board-cell/BoardCell"
import ChessBoard from "../../components/chess-match/chess-board/ChessBoard"
import LetterCoord from "../../components/chess-match/chess-coord/letter-coord/LetterCoord"
import NumberCoord from "../../components/chess-match/chess-coord/number-coord/NumberCoord"
import ChessPieceComponent from "../../components/chess-match/chess-piece/ChessPieceComponent"
import MatchInfo from "../../components/chess-match/match-info.tsx/MatchInfo"
import PawnPromotionModalWindow from "../../components/chess-match/pawn-promotion-modal-window/PawnPromotionModalWindow"
import ModalWindow from "../../components/modal-window/ModalWindow"
import MyButton from "../../components/my-button/MyButton"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { BoardState } from "../../models/chess-game/BoardState"
import { IChessCoords, PieceViewStatus } from "../../models/chess-game/ChessCommon"
import { findPossibleMoves, IChessPiece} from "../../models/chess-game/exports"
import { BoardCellEntityEnum, IBoardCellEntity } from "../../models/chess-game/IBoardCellEntity"
import { IPossibleMoveCell } from "../../models/chess-game/IPossibleMoveCell"
import { WebsocketErrorEnum } from "../../models/DTO/match/websocket/WebsocketErrorEnum"
import { closeConnectionAndClearMatchState, getMatchStateAndSubscribeToMatch, getUsersRatingsData, sendChessMove } from "../../services/MatchService"
import { matchSlice } from "../../store/reducers/MatchReducer"
import { deleteSelectionFromBoardState } from "../../utils/ChessGameUtils"
import { myHistory } from "../../utils/History"
import styles from './Match.module.css';



const Match: FC = () => {

  const location = useLocation();
  const matchData = useAppSelector(state => state.matchData)
  const match = matchData.match;
  const dispatch = useAppDispatch();

  const [pawnPromotionModalWindowCoords, setPawnPromotionModalWindowCoords] = useState({numberCoord: -1, letterCoord: -1} as IChessCoords);

  const letterCoordsArray: Array<string> = Array.from("abcdefgh");
  const numberCoordsArray: Array<string> = Array.from("12345678");


  useEffect(() => {
    const url = location.pathname;
    const matchId = Number(url.slice(url.lastIndexOf("/") + 1 ));


    if (Number.isNaN(matchId) || matchId < 0) {
      console.error("Wrong match id!");
    } else if (!match || matchData.subscribeErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_NO_ACTIVE_MATCH && matchData.subscribeConnectionAttemptsCount <= 4) {
      console.log("Try connecting")
      getMatchStateAndSubscribeToMatch(matchId);
      getUsersRatingsData(matchId);
    }

    console.log("updated")

   }, [matchData.subscribeErrorCode])


   useEffect(() => {
      return function cleanup() {
        console.log("clean up")
        closeConnectionAndClearMatchState();
      };
   }, []);

  
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

  const [jsonToSend, setJsonToSend] = useState("");

  const sendToWebsocket = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);

    if (!client.active) {
      throw new Error("The client is not active! " + WebsocketConnectionEnum.CHESS_MATCH);
    }
  
    client.send(getWebsocetSendEndpoint(WebsocketConnectionEnum.CHESS_MATCH), {}, jsonToSend);
    setJsonToSend("");
  }


  const backToSearchGame = (e: React.MouseEvent) => {
    e.preventDefault();

    myHistory.push(`/`)
  }

  const refreshPage = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  };


  return (
      <div>
        <h1>Match</h1>
        <form>
          <label>
            Webscoket request:
            <input value={jsonToSend} type="text" onChange={(e) => {setJsonToSend(e.target.value)}}/>
          </label>
          <button onClick={sendToWebsocket}>Send to Webscoket</button>
        </form>
        {(matchData.subscribeErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_SUBSCRIBED || matchData.subscribeErrorCode && matchData.subscribeConnectionAttemptsCount > 4) &&
          <ModalWindow>
              <Fragment>
                <p>{matchData.subscribeError}</p>
                <div className={styles.buttonsGrid}>
                    <MyButton makeAction={backToSearchGame}>Вернуться на главную</MyButton>
                    <MyButton makeAction={refreshPage}>Обновить страницу</MyButton>
                </div>
              </Fragment>
          </ModalWindow>
        }
        {match && matchData.matchLoaded && !matchData.subscribeError &&
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
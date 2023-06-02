import { CompatClient } from "@stomp/stompjs"
import _ from "lodash"
import React, { FC, Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { getWebsocetSendEndpoint } from "../../api/Endpoints"
import { WebsocketClientsHolder } from "../../api/WebsocketClientsHolder"
import { WebsocketConnectionEnum } from "../../api/websocketFunctions/WebsocketFunctions"
import BoardCell from "../../components/chess-game/board-cell/BoardCell"
import ChessBoard from "../../components/chess-game/chess-board/ChessBoard"
import LetterCoord from "../../components/chess-game/chess-coord/letter-coord/LetterCoord"
import NumberCoord from "../../components/chess-game/chess-coord/number-coord/NumberCoord"
import ChessPieceComponent from "../../components/chess-game/chess-piece/ChessPieceComponent"
import GameInfo from "../../components/chess-game/game-info.tsx/GameInfo"
import PawnPromotionModalWindow from "../../components/chess-game/pawn-promotion-modal-window/PawnPromotionModalWindow"
import LoadingMessage from "../../components/loading-message/LoadingMessage"
import ModalWindow from "../../components/modal-window/ModalWindow"
import MyButton from "../../components/my-button/MyButton"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { BoardState } from "../../models/chess-game/BoardState"
import { IChessCoords, PieceViewStatus } from "../../models/chess-game/ChessCommon"
import { findPossibleMoves, IChessPiece} from "../../models/chess-game/exports"
import { BoardCellEntityEnum, IBoardCellEntity } from "../../models/chess-game/IBoardCellEntity"
import { IBoardCell } from "../../models/chess-game/IBoardCell"
import { WebsocketErrorEnum } from "../../models/DTO/game/websocket/WebsocketErrorEnum"
import { closeConnectionAndClearGameState, getGameStateAndSubscribeToGame, getUsersRatingsData, sendChessMove } from "../../services/GameService"
import { gameSlice } from "../../store/reducers/GameReducer"
import { deleteSelectionFromBoardState } from "../../utils/ChessGameUtils"
import { myHistory } from "../../utils/History"
import styles from './Game.module.css';



const Game: FC = () => {

  const location = useLocation();
  const gameData = useAppSelector(state => state.gameData)
  const game = gameData.game;
  const dispatch = useAppDispatch();

  const [pawnPromotionModalWindowCoords, setPawnPromotionModalWindowCoords] = useState({numberCoord: -1, letterCoord: -1} as IChessCoords);

  const letterCoordsArray: Array<string> = Array.from("abcdefgh");
  const numberCoordsArray: Array<string> = Array.from("12345678");


  useEffect(() => {
    const url = location.pathname;
    const gameId = url.slice(url.lastIndexOf("/") + 1 );


    if (!gameId) {
      console.error("Wrong game id!");
    } else if (!game || gameData.subscribeErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_NO_ACTIVE_GAME && gameData.subscribeConnectionAttemptsCount <= 4) {
      console.log("Try connecting")
      getGameStateAndSubscribeToGame(gameId);
      getUsersRatingsData(gameId);
    }

    console.log("updated")

   }, [gameData.subscribeErrorCode])


   useEffect(() => {
      return function cleanup() {
        console.log("clean up")
        closeConnectionAndClearGameState();
      };
   }, []);

  
  function selectChessPiece(e: React.MouseEvent<any>, startCoords: IChessCoords): void {
    e.stopPropagation();
    e.preventDefault();

    if (game && !gameData.sendingChessMove) {
      if ((game.boardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece).viewStatus === PieceViewStatus.selected) {
        dispatch(gameSlice.actions.clearBoardState());
        return;
      }

      const newBoardState: BoardState = _.cloneDeep(game.boardState);
      if (gameData.pieceSelected) {
        deleteSelectionFromBoardState(newBoardState);
      }

      const newSelectedChessPiece: IChessPiece = newBoardState[startCoords.numberCoord][startCoords.letterCoord] as IChessPiece;
      findPossibleMoves(newSelectedChessPiece, newBoardState, game.enPassantPawnCoords, startCoords)
      dispatch(gameSlice.actions.selectChessPiece({boardState: newBoardState, selectChessPieceStart: {startPiece: newSelectedChessPiece.type, startCoords: startCoords}}));

    } else {
      throw new Error("No game was found");
    }
  }

  function makeChessMove(e: React.MouseEvent<any>, endCoords: IChessCoords): void { 
    e.stopPropagation();
    e.preventDefault();

    if (game && !gameData.sendingChessMove) {
      const endPiece: IBoardCellEntity = game.boardState[endCoords.numberCoord][endCoords.letterCoord] as IBoardCellEntity;

      if (gameData.newMoveStart?.startPiece === BoardCellEntityEnum.pawn && (endCoords.numberCoord === 0 || endCoords.numberCoord === 7)) {
        setPawnPromotionModalWindowCoords(endCoords);
        return;
      }

      let castling: number | undefined;
      let endPieceType: BoardCellEntityEnum | null = null;

      if (endPiece.type !== BoardCellEntityEnum.boardCell) {
        endPieceType = endPiece.type;
      } else {
        castling = (endPiece as IBoardCell).castling;
      }
      
      sendChessMove({endPiece: endPieceType, endCoords: endCoords, castling: castling})
    } else {
      throw new Error("game was not found");
    }
  }


  const backToSearchGame = () => {
    myHistory.push(`/`)
  }

  const refreshPage = () => {
    window.location.reload();
  };


  return (
      <div>
        {(!game || !gameData.gameLoaded) && <LoadingMessage/>}

        {(gameData.subscribeErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL
          || gameData.subscribeErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_SUBSCRIBED
          || gameData.subscribeConnectionAttemptsCount > 4) &&
          <ModalWindow>
              <Fragment>
                <p>{gameData.subscribeError ? gameData.subscribeError : "Неизвестная ошибка."}</p>
                <div className={styles.buttonsGrid}>
                    <MyButton makeAction={backToSearchGame}>Вернуться на главную</MyButton>
                    <MyButton makeAction={refreshPage}>Обновить страницу</MyButton>
                </div>
              </Fragment>
          </ModalWindow>
        }
        {game && gameData.gameLoaded && !gameData.subscribeError &&
          <div className={styles.gameContent}>
            <ChessBoard>
              {numberCoordsArray.map((coordName, i) => {
                  return (<NumberCoord key={String(i) + String(0)} playerColor={gameData.myColor} coordNumber={+i}>{coordName}</NumberCoord>)
                })
              }

              {letterCoordsArray.map((coordName, j) => {
                  return (<LetterCoord key={String(0) + String(j)} playerColor={gameData.myColor} coordNumber={+j}>{coordName}</LetterCoord>)
                })
              }

              {pawnPromotionModalWindowCoords.numberCoord >= 0 &&
                <PawnPromotionModalWindow playerColor={gameData.myColor} pieceCoords={pawnPromotionModalWindowCoords} setChessCoordsToChangeVisibility={setPawnPromotionModalWindowCoords}/>
              }
              
              {gameData.myTurn && gameData.viewedMoveNumber === gameData.lastMoveNumber ?
                game.boardState.map((row, i) => {
                  return (
                    row.map((cell, j) => {
                      if (cell != null) {
                        if ((cell as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
                          const chessPiece: IChessPiece = cell as IChessPiece;
    
                          if (chessPiece.color === gameData.myColor) {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={gameData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={selectChessPiece}/>
                          } else if (chessPiece.viewStatus === PieceViewStatus.underAttack) {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={gameData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}} customClickEvent={makeChessMove}/>
                          } else {
                            return <ChessPieceComponent key={String(i) + String(j)} playerColor={gameData.myColor} chessPiece={chessPiece} pieceCoords={{numberCoord: i, letterCoord: j}}/>
                          }
                        } else {
                          const boardCell: IBoardCell = cell as IBoardCell;
                          const onClickFunction = boardCell.possibleMove ? makeChessMove : undefined;
                          return <BoardCell key={String(i) + String(j)} playerColor={gameData.myColor} boardCell={boardCell} cellCoords={{numberCoord: i, letterCoord: j}} customClickEvent={onClickFunction}/>
                        }
                      }
                    }
                  ))
                })
              :
                game.boardState.map((row, i) => {
                  return (
                    row.map((cell, j) => {
                      if (cell != null) {
                        if ((cell as IBoardCellEntity).type !== BoardCellEntityEnum.boardCell) {
                          return <ChessPieceComponent key={String(i) + String(j)} playerColor={gameData.myColor} chessPiece={cell as IChessPiece} pieceCoords={{numberCoord: i, letterCoord: j}}/>
                        } else {
                          return <BoardCell key={String(i) + String(j)} playerColor={gameData.myColor} boardCell={cell as IBoardCell} cellCoords={{numberCoord: i, letterCoord: j}}/>
                        }
                      }
                    }
                  ))
                })
              }
            </ChessBoard>
            <GameInfo/>
          </div>
        }
      </div>
  )
}

export default Game
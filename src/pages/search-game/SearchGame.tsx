import { CompatClient } from "@stomp/stompjs";
import React, { FC, Fragment, useEffect, useState } from "react";
import { getWebsocetSendEndpoint } from "../../api/Endpoints";
import { WebsocketClientsHolder } from "../../api/WebsocketClientsHolder";
import { WebsocketConnectionEnum } from "../../api/websocketFunctions/WebsocketFunctions";
import ModalWindow from "../../components/modal-window/ModalWindow";
import MyButton from "../../components/my-button/MyButton";
import Sidebar from "../../components/sidebar/Sidebar";
import ForwardTimer from "../../components/timers/forward-timer/ForwardTimer";
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks";
import { WebsocketErrorEnum } from "../../models/DTO/game/websocket/WebsocketErrorEnum";
import { cancelFindGame, findGame, getUserInGameStatus } from "../../services/GameService";
import { gameSlice } from "../../store/reducers/GameReducer";
import { myHistory } from "../../utils/History";
import styles from './SearchGame.module.css';
import stylesCommon from '../PageWithSidebar.module.css';
import SearchGameButton from "../../components/search-game-button/SearchGameButton";
import { authSlice } from "../../store/reducers/AuthReducer";
import { CurrentPageEnum } from "../../models/ApplicationCommon";
import { ChessGameTypes, ChessGameTypesArray, ChessGameTypesType } from "../../models/chess-game/ChessGameType";
import { Link } from "react-router-dom";
import LoadingMessage from "../../components/loading-message/LoadingMessage";


const SearchGame: FC = () => {

  const authData = useAppSelector(state => state.authData);
  const gameData = useAppSelector(state => state.gameData);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (authData.loggedIn) {
      getUserInGameStatus();
    } else {
      dispatch(gameSlice.actions.setSearchPageLoaded(true));
    }

  }, [authData.loggedIn]);

  useEffect(() => {
    dispatch(authSlice.actions.setCurrentPage(CurrentPageEnum.SEARCH_GAME));

    return function cleanup() {
      dispatch(authSlice.actions.setCurrentPage(null));
      dispatch(gameSlice.actions.setSearchPageLoaded(false));
    }; 
  }, []);


  const handleFindGame = (chessGameType?: ChessGameTypesType) => {
    if (chessGameType !== undefined) {
      findGame(chessGameType);
    }
  }


  const cancelSearch = () => {
    cancelFindGame();
  }

  const closeFindGameWindow = () => {
    dispatch(gameSlice.actions.searchClearError());
  }

  const connectToGame = () => {
    if (gameData.searchError) {
      dispatch(gameSlice.actions.searchClearError());
    }

    myHistory.push(`/game/${gameData.gameId}`)
  };


  const [jsonToSend, setJsonToSend] = useState("");

  const sendToWebsocket = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_GAME);

    if (!client.active) {
      throw new Error("The client is not active! " + WebsocketConnectionEnum.FIND_GAME);
    }
  
    client.send(getWebsocetSendEndpoint(WebsocketConnectionEnum.FIND_GAME), {}, jsonToSend);
    setJsonToSend("");
  }

  

  return (
    <Fragment>

      {(!gameData.searchPageLoaded || !authData.loggedIn && authData.loading) ?
        <LoadingMessage/>
      :     
        <Fragment>
          {(gameData.searchStart || gameData.searching || gameData.searchError) &&
            <ModalWindow>
              {gameData.searchStart ? 
                <p>Подключаемся к серверу...</p>
              :
                <Fragment>
                  {gameData.searchError ? 
                    <Fragment>
                      <p>{gameData.searchError}</p>
                      {gameData.searchErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_IN_GAME ? 
                        <div className={styles.buttonsGrid}>
                          <MyButton makeAction={connectToGame}>Перейти к игре</MyButton>
                          <MyButton makeAction={closeFindGameWindow}>Отмена</MyButton>
                        </div>
                      :
                        <MyButton makeAction={closeFindGameWindow}>Ок</MyButton>
                      }
                    </Fragment>
                  : 
                    <Fragment>
                      <p>Идёт поиск матча...</p>
                      <ForwardTimer time={0}/>
                    </Fragment>
                  }

                  <br/>
                  {gameData.searchCancelError ?
                    <p>{gameData.searchCancelError}</p>
                  :
                    gameData.searching && <MyButton makeAction={cancelSearch} disabled={gameData.searchCanceling}>Отменить</MyButton>
                  }
                </Fragment>
              }
            </ModalWindow>
          }

          <div className={stylesCommon.pageWithSidebar}>
            <Sidebar/>
            <div className={stylesCommon.pageWithSidebarContent}>
              {authData.loggedIn ? 
                <Fragment>
                  {gameData.gameId && gameData.activeGame ?
                    <Fragment>
                      <p>Завершите текущую партию, прежде чем искать следующую!</p>
                      <div className={styles.goToGameWrapper}>
                        <SearchGameButton makeAction={connectToGame}>
                          <div className={styles.searchGameButtonLowSizeText}>перейти к игре</div>
                        </SearchGameButton>
                      </div>
                    </Fragment>
                  :
                  <Fragment>
                      <div className={styles.searchGameButtonsContainer}>
                        {ChessGameTypesArray.map((chessGameType, i) => {
                          return (
                            <div key={i} className={styles.searchGameButtonWrapper}>
                              <SearchGameButton makeAction={handleFindGame} disabled={gameData.searchStart || gameData.searching} chessGameType={chessGameType}>
                                <Fragment>
                                  <div className={styles.searchGameButtonHeader}>{ChessGameTypes[chessGameType].simpleName}</div>
                                  <div className={styles.searchGameButtonLowSizeText}>{ChessGameTypes[chessGameType].timeControl}</div>
                                </Fragment>
                              </SearchGameButton>
                            </div>
                          );
                        })}
                      </div>
        
      
                  </Fragment>
                  }
                </Fragment>
              :
                <p><Link className={styles.link} to="/login">Войдите</Link> или <Link className={styles.link} to="/register">зарегистрируйтесь</Link>, чтобы приступить к поиску игры.</p>
              }
            </div>
          </div>
        </Fragment>
      }
    </Fragment>
    
  )
}



export default SearchGame;
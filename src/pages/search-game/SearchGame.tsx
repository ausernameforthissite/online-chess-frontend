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
import { WebsocketErrorEnum } from "../../models/DTO/match/websocket/WebsocketErrorEnum";
import { cancelFindMatch, findMatch, getUserInMatchStatus } from "../../services/MatchService";
import { matchSlice } from "../../store/reducers/MatchReducer";
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
  const matchData = useAppSelector(state => state.matchData);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (authData.loggedIn) {
      getUserInMatchStatus();
    } else {
      dispatch(matchSlice.actions.setSearchPageLoaded(true));
    }

  }, [authData.loggedIn]);

  useEffect(() => {
    dispatch(authSlice.actions.setCurrentPage(CurrentPageEnum.SEARCH_GAME));

    return function cleanup() {
      dispatch(authSlice.actions.setCurrentPage(null));
      dispatch(matchSlice.actions.setSearchPageLoaded(false));
    }; 
  }, []);


  const handleFindMatch = (chessGameType?: ChessGameTypesType) => {
    if (chessGameType !== undefined) {
      findMatch(chessGameType);
    }
  }


  const cancelSearch = () => {
    cancelFindMatch();
  }

  const closeFindMatchWindow = () => {
    dispatch(matchSlice.actions.searchClearError());
  }

  const connectToMatch = () => {
    if (matchData.searchError) {
      dispatch(matchSlice.actions.searchClearError());
    }

    myHistory.push(`/match/${matchData.matchId}`)
  };


  const [jsonToSend, setJsonToSend] = useState("");

  const sendToWebsocket = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);

    if (!client.active) {
      throw new Error("The client is not active! " + WebsocketConnectionEnum.FIND_MATCH);
    }
  
    client.send(getWebsocetSendEndpoint(WebsocketConnectionEnum.FIND_MATCH), {}, jsonToSend);
    setJsonToSend("");
  }

  

  return (
    <Fragment>

      {(!matchData.searchPageLoaded || !authData.loggedIn && authData.loading) ?
        <LoadingMessage/>
      :     
        <Fragment>
          {(matchData.searchStart || matchData.searching || matchData.searchError) &&
            <ModalWindow>
              {matchData.searchStart ? 
                <p>Подключаемся к серверу...</p>
              :
                <Fragment>
                  <form>
                    <label>
                      Webscoket request:
                      <input value={jsonToSend} type="text" onChange={(e) => {setJsonToSend(e.target.value)}}/>
                    </label>
                    <button style={{color: "black"}} onClick={sendToWebsocket}>Send to Webscoket</button>
                  </form>
                  
                  {matchData.searchError ? 
                    <Fragment>
                      <p>{matchData.searchError}</p>
                      {matchData.searchErrorCode === WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_IN_MATCH ? 
                        <div className={styles.buttonsGrid}>
                          <MyButton makeAction={connectToMatch}>Перейти к игре</MyButton>
                          <MyButton makeAction={closeFindMatchWindow}>Отмена</MyButton>
                        </div>
                      :
                        <MyButton makeAction={closeFindMatchWindow}>Ок</MyButton>
                      }
                    </Fragment>
                  : 
                    <Fragment>
                      <p>Идёт поиск матча...</p>
                      <ForwardTimer time={0}/>
                    </Fragment>
                  }

                  <br/>
                  {matchData.searchCancelError ?
                    <p>{matchData.searchCancelError}</p>
                  :
                    matchData.searching && <MyButton makeAction={cancelSearch} disabled={matchData.searchCanceling}>Отменить</MyButton>
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
                  {matchData.matchId && matchData.activeMatch ?
                    <Fragment>
                      <p>Завершите текущую партию, прежде чем искать следующую!</p>
                      <div className={styles.goToGameWrapper}>
                        <SearchGameButton makeAction={connectToMatch}>
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
                              <SearchGameButton makeAction={handleFindMatch} disabled={matchData.searchStart || matchData.searching} chessGameType={chessGameType}>
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
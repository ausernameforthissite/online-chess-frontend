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


const SearchGame: FC = () => {

  const authData = useAppSelector(state => state.authData)
  const matchData = useAppSelector(state => state.matchData)
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (authData.loggedIn) {
      getUserInMatchStatus();
    }

  }, [authData.loggedIn]);


  const handleFindMatch = (e: React.MouseEvent) => {
    e.preventDefault();
    findMatch();
  };

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
          <h1>
            Main page
          </h1>
          {authData.loggedIn ? 
            <Fragment>
              <p>Hello, user {authData.username}</p>
              {matchData.matchId && matchData.activeMatch ?
                <Fragment>
                  <p>Вы уже в игре</p>
                  <button style={{color: "black"}} onClick={handleFindMatch}>Find match</button>
                  <button style={{color: "black"}} onClick={connectToMatch}>Подключиться</button>
                </Fragment>
              :
                <button style={{color: "black"}} onClick={handleFindMatch}>Find match</button>
              }
            </Fragment>
          :
            <p>Вы неавторизованы!</p>
          }
        </div>
      </div>

    </Fragment>
    
  )
}

export default SearchGame;
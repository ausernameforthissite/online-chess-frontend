import React, { FC, Fragment } from "react";
import FindMatchModalWindow from "../../components/find-match-modal-window/FindMatchModalWindow";
import Sidebar from "../../components/sidebar/Sidebar";
import { useAppSelector } from "../../hooks/ReduxHooks";
import { findMatch } from "../../services/MatchService";
import styles from './SearchGame.module.css';


const SearchGame: FC = () => {

  const loggedIn: boolean = useAppSelector(state => state.authData.loggedIn)
  const visible: boolean = useAppSelector(state => state.matchData.searchWindowView)
  const username: string | null = useAppSelector(state => state.authData.username)


  const handleFindMatch = (e: React.MouseEvent) => {
    e.preventDefault();

    findMatch()
  };


  return (
    <Fragment>
      {visible && <FindMatchModalWindow/>}

      <div className={styles.searchGamePage}>
        <Sidebar/>

        <div className={styles.searchGamePageContent}>
          <h1>
            Main page
          </h1>
          {loggedIn ? 
            <Fragment>
              <p>Hello, user {username}</p>
              <button onClick={handleFindMatch}>Find match</button>
            </Fragment>
          : <p>Вы неавторизованы!</p>}
        </div>
      </div>
        
    </Fragment>
    
  )
}

export default SearchGame;
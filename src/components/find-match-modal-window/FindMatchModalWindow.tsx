import { FC, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks";
import { cancelFindMatch } from "../../services/MatchService";
import { matchSlice } from "../../store/reducers/MatchReducer";
import { myHistory } from "../../utils/History";
import ForwardTimer from "../timers/forward-timer/ForwardTimer";
import styles from './FindMatchModalWindow.module.css';



const FindMatchModalWindow: FC = () => {

  const matchData = useAppSelector(state => state.matchData)
  const dispatch = useAppDispatch();

  function cancelSearch(e: React.MouseEvent) {
    e.preventDefault();

    cancelFindMatch();
  }

  function closeFindMatchWindow(e: React.MouseEvent) {
    e.preventDefault();
    dispatch(matchSlice.actions.searchWindowViewFalse());

    if (matchData.matchId && matchData.activeMatch) {
      myHistory.push(`/match/${matchData.matchId}`)
    }
  }


  return (
      <div className={styles.myModal}>
          <div className={styles.myModalContent}>
                <Fragment>
                  {matchData.searchError ? 
                    <Fragment>
                      <p>{matchData.searchError}</p>
                      <button onClick={closeFindMatchWindow}>{matchData.activeMatch ? "Go to match": "Ok"}</button>
                    </Fragment>
                  : 
                    <Fragment>
                      <p>Идёт поиск матча...</p>
                      <ForwardTimer time={0}/>
                    </Fragment>}
                  <br/>
                  {matchData.searchCancelError ?
                    <p>{matchData.searchCancelError}</p>
                  :  matchData.searching && <button onClick={cancelSearch} disabled={matchData.searchCanceling}>Отменить</button>}
                </Fragment>
          </div>
      </div>
  );
};


export default FindMatchModalWindow;
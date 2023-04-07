import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import SecondsCountdownTimer from "../../../timers/seconds-countdown-timer/SecondsCountdownTimer";
import { InternalComponentsProps } from "../MatchInfo";
import styles from './FirstMoveTimer.module.css';


const FirstMoveTimer: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const matchData = useAppSelector(state => state.matchData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <Fragment>
          {matchData.activeMatch && matchData.matchRecord!.length === 0 && matchData.whiteFirstMoveTimeLeftMS >= 0 &&
            <div className={styles.firstMoveTimer}>
              <div>осталось секунд на первый ход:&nbsp;</div>
              <SecondsCountdownTimer timeLeftMS={matchData.whiteFirstMoveTimeLeftMS} addWordSecondsWithEnding={false}/>
            </div>}
        </Fragment>
      :
        <Fragment>
          {matchData.activeMatch && matchData.matchRecord!.length === 1 && matchData.blackFirstMoveTimeLeftMS >= 0 &&
            <div className={styles.firstMoveTimer}>
              <div>осталось секунд на первый ход:&nbsp;</div>
              <SecondsCountdownTimer timeLeftMS={matchData.blackFirstMoveTimeLeftMS} addWordSecondsWithEnding={false}/>
            </div>}
        </Fragment>
      }
    </Fragment>
  );

}

export default FirstMoveTimer;
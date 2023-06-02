import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import SecondsCountdownTimer from "../../../timers/seconds-countdown-timer/SecondsCountdownTimer";
import { InternalComponentsProps } from "../GameInfo";
import styles from './FirstMoveTimer.module.css';


const FirstMoveTimer: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const gameData = useAppSelector(state => state.gameData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <Fragment>
          {gameData.activeGame && gameData.gameRecord!.length === 0 && gameData.whiteFirstMoveTimeLeftMS >= 0 &&
            <div className={styles.firstMoveTimer}>
              <div>осталось секунд на первый ход:&nbsp;</div>
              <SecondsCountdownTimer timeLeftMS={gameData.whiteFirstMoveTimeLeftMS} addWordSecondsWithEnding={false}/>
            </div>}
        </Fragment>
      :
        <Fragment>
          {gameData.activeGame && gameData.gameRecord!.length === 1 && gameData.blackFirstMoveTimeLeftMS >= 0 &&
            <div className={styles.firstMoveTimer}>
              <div>осталось секунд на первый ход:&nbsp;</div>
              <SecondsCountdownTimer timeLeftMS={gameData.blackFirstMoveTimeLeftMS} addWordSecondsWithEnding={false}/>
            </div>}
        </Fragment>
      }
    </Fragment>
  );

}

export default FirstMoveTimer;
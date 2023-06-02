import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import SecondsCountdownTimer from "../../../timers/seconds-countdown-timer/SecondsCountdownTimer";
import { InternalComponentsProps } from "../GameInfo";
import parentStyles from '../GameInfo.module.css';
import styles from './PlayerLeftGame.module.css';


const PlayerLeftGame: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const gameData = useAppSelector(state => state.gameData)


  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <Fragment>
          {!gameData.whiteUserOnline && gameData.whiteReconnectTimeLeftMS >= 0 &&
            <div className={parentStyles.messageContainer + " " + styles.leftGameTimer}>
              <span>Белые покинули игру. Чёрным будет засчитана победа через&nbsp;</span>
              <SecondsCountdownTimer timeLeftMS={gameData.whiteReconnectTimeLeftMS} addWordSecondsWithEnding={true}/>
            </div>
          }
        </Fragment>
      :
        <Fragment>
          {!gameData.blackUserOnline && gameData.blackReconnectTimeLeftMS >= 0 &&
            <div className={parentStyles.messageContainer + " " + styles.leftGameTimer}>
              <span>Чёрные покинули игру. Белым будет засчитана победа через&nbsp;</span>
              <SecondsCountdownTimer timeLeftMS={gameData.blackReconnectTimeLeftMS} addWordSecondsWithEnding={true}/>
            </div>
          }
        </Fragment>
      }
    </Fragment>
  );

}

export default PlayerLeftGame;
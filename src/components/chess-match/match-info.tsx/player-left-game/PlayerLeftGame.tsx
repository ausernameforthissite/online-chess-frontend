import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import SecondsCountdownTimer from "../../../timers/seconds-countdown-timer/SecondsCountdownTimer";
import { InternalComponentsProps } from "../MatchInfo";
import parentStyles from '../MatchInfo.module.css';
import styles from './PlayerLeftGame.module.css';


const PlayerLeftGame: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const matchData = useAppSelector(state => state.matchData)


  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <Fragment>
          {!matchData.whiteUserOnline && matchData.whiteReconnectTimeLeftMS >= 0 &&
            <div className={parentStyles.messageContainer + " " + styles.leftGameTimer}>
              <span>Белые покинули игру. Чёрным будет засчитана победа через&nbsp;</span>
              <SecondsCountdownTimer timeLeftMS={matchData.whiteReconnectTimeLeftMS} addWordSecondsWithEnding={true}/>
            </div>
          }
        </Fragment>
      :
        <Fragment>
          {!matchData.blackUserOnline && matchData.blackReconnectTimeLeftMS >= 0 &&
            <div className={parentStyles.messageContainer + " " + styles.leftGameTimer}>
              <span>Чёрные покинули игру. Белым будет засчитана победа через&nbsp;</span>
              <SecondsCountdownTimer timeLeftMS={matchData.blackReconnectTimeLeftMS} addWordSecondsWithEnding={true}/>
            </div>
          }
        </Fragment>
      }
    </Fragment>
  );

}

export default PlayerLeftGame;
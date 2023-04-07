import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import MainGameTimer from "../../../timers/main-game-timer/MainGameTimer";
import { InternalComponentsProps } from "../MatchInfo";




const MainTimer: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const matchData = useAppSelector(state => state.matchData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <MainGameTimer timeLeftMS={matchData.whiteTimeLeftMS} stopped={matchData.whiteTimerStopped}/>
      :
        <MainGameTimer timeLeftMS={matchData.blackTimeLeftMS} stopped={matchData.blackTimerStopped}/>
      }
    </Fragment>
  );
  
};


export default MainTimer;
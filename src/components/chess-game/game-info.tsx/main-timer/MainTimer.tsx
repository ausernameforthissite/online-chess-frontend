import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import MainGameTimer from "../../../timers/main-game-timer/MainGameTimer";
import { InternalComponentsProps } from "../GameInfo";




const MainTimer: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const gameData = useAppSelector(state => state.gameData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <MainGameTimer timeLeftMS={gameData.whiteTimeLeftMS} stopped={gameData.whiteTimerStopped}/>
      :
        <MainGameTimer timeLeftMS={gameData.blackTimeLeftMS} stopped={gameData.blackTimerStopped}/>
      }
    </Fragment>
  );
  
};


export default MainTimer;
import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import PlayerInfo from "../../player-info/PlayerInfo";
import { InternalComponentsProps } from "../GameInfo";



const PlayerInfoSelector: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const gameData = useAppSelector(state => state.gameData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <PlayerInfo username={gameData.game!.usersInGame.whiteUsername} online={gameData.whiteUserOnline} showOnline={gameData.activeGame}
                    rating={gameData.whiteRating} ratingChange={gameData.whiteRatingChange} displacementStyle={getDisplacementStyle(true)}/>
      :
        <PlayerInfo username={gameData.game!.usersInGame.blackUsername} online={gameData.blackUserOnline} showOnline={gameData.activeGame}
                    rating={gameData.blackRating} ratingChange={gameData.blackRatingChange} displacementStyle={getDisplacementStyle(true)}/>
      }
    </Fragment>
  );

}

function getDisplacementStyle(top: boolean): React.CSSProperties {
  if (top) {
    return {
      paddingBottom: "5px",
    } as React.CSSProperties;
  } else {
    return {
      paddingTop: "5px",
    } as React.CSSProperties;
  }
}

export default PlayerInfoSelector;
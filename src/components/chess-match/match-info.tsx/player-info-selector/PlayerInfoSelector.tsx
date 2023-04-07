import { FC, Fragment } from "react";
import { useAppSelector } from "../../../../hooks/ReduxHooks";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import PlayerInfo from "../../player-info/PlayerInfo";
import { InternalComponentsProps } from "../MatchInfo";



const PlayerInfoSelector: FC<InternalComponentsProps> = ({userColor}: InternalComponentsProps) => {

  const matchData = useAppSelector(state => state.matchData)

  return (
    <Fragment>
      {userColor === ChessColor.white ?
        <PlayerInfo username={matchData.match!.usersInMatch.whiteUsername} online={matchData.whiteUserOnline} showOnline={matchData.activeMatch}
                    rating={matchData.whiteRating} ratingChange={matchData.whiteRatingChange} displacementStyle={getDisplacementStyle(true)}/>
      :
        <PlayerInfo username={matchData.match!.usersInMatch.blackUsername} online={matchData.blackUserOnline} showOnline={matchData.activeMatch}
                    rating={matchData.blackRating} ratingChange={matchData.blackRatingChange} displacementStyle={getDisplacementStyle(true)}/>
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
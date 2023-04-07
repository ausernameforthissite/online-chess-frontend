import React, { FC, useEffect, useState} from "react";
import styles from './PlayerInfo.module.css';

type Props = {
  username: string,
  online: boolean,
  showOnline: boolean,
  rating: number,
  ratingChange: number | null,
  displacementStyle: React.CSSProperties
};


const PlayerInfo: FC<Props> = (props: Props) => {
  const defaultStyle: React.CSSProperties = {};
  const [onlineStatusStyle, setOnlineStatusStyle] = useState(defaultStyle);
  const [ratingChangeStyle, setRatingChangeStyle] = useState(defaultStyle);

  const [ratingChangeString, setRatingChangeString] = useState("");




  useEffect(() => {
    const onlineStatusColor: string = props.online ? 'rgb(30, 200, 100)' : 'transparent';
    const statusStyle: React.CSSProperties = {
      backgroundColor: onlineStatusColor,
    };
  
    setOnlineStatusStyle(statusStyle);

    if (props.ratingChange !== null) {
      let ratingChangeColor: string = "rgb(240, 45, 90)";
      let ratingEndString: string = "(";

      if (props.ratingChange === 0) {
        ratingEndString += '±';
        ratingChangeColor = "inherit";
      } else if (props.ratingChange > 0) {
        ratingEndString += "+";
        ratingChangeColor = 'rgb(30, 200, 100)'
      }
      ratingEndString += props.ratingChange + ")";

      const changeStyle: React.CSSProperties = {
        color: ratingChangeColor,
      };
    
      setRatingChangeString(ratingEndString);
      setRatingChangeStyle(changeStyle);
    }

}, [props])



  return (
    <div className={styles.playerInfo} style={props.displacementStyle}>
      {props.showOnline &&
        <div className={styles.onlineStatus} style={onlineStatusStyle}/>
      }
      <div className={styles.usernameAndRating}>
        <div className={styles.username}>{props.username}</div>
          {props.rating >= 0 &&
            <div className={styles.rating}>{props.rating} {props.ratingChange !== null && 
                <span style={ratingChangeStyle}>&nbsp;{ratingChangeString}</span>
              }
            </div>
          }
      </div>
    </div>
  )
}

export default PlayerInfo;
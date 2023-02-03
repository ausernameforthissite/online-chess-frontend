import React, { FC, useEffect, useState } from "react";
import CHESS_MATCH from "../../images/ImagesConstants";
import { ChessColor } from "../../models/chess-game/ChessCommon";
import styles from './ChessBoard.module.css';


type Props = {
  children: any,
  playerColor: ChessColor
};

const ChessBoard: FC<Props> = ({children, playerColor}) => {

  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);
  

  useEffect(() => {
    const scale : number = playerColor === ChessColor.white ? 1 : -1;

    const actualStyle: React.CSSProperties = {
      backgroundImage: `url("${CHESS_MATCH.chessField}")`,
      transform: `scalyY(${scale})`
    };

    setMyStyle(actualStyle);
  }, [])

  return (
    <div className={styles.chessBoard} style={myStyle}>
      {children}
    </div>
  )
}

export default ChessBoard;
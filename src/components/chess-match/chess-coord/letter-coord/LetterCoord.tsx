import React, { FC, useEffect, useState } from "react";
import { ChessColor } from "../../../../models/chess-game/ChessCommon";
import styles from '../ChessCoord.module.css';

type Props = {
  playerColor: ChessColor
  coordNumber: number
  children: string
};


const LetterCoord: FC<Props> = ({playerColor, coordNumber, children}) => {
  
  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);


  const cellSize : number = 100;


  useEffect(() => {

    let x : number
    let y : number
    let coordColor: string;

    if (playerColor === ChessColor.white) {
      x = cellSize * coordNumber  + 88
      y = cellSize * 7 + 78
      coordColor = coordNumber % 2 === 0 ? 'rgb(200, 220, 255)' : 'rgb(128, 148, 230)'
    } else {
      x = cellSize * (7 - coordNumber) + 88
      y = cellSize * 7 + 78
      coordColor = coordNumber % 2 === 1 ? 'rgb(200, 220, 255)' : 'rgb(128, 148, 230)'
    }

    const actualStyle: React.CSSProperties = {
      left: `${x}px`,
      top: `${y}px`,
      color: coordColor,
    };

    setMyStyle(actualStyle);
  }, []);



  return (
    <div className={styles.chessCoord} style={myStyle}>
      {children}
    </div>
  )
}

export default LetterCoord;
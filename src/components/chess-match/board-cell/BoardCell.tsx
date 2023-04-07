import React, { FC, useEffect, useState } from "react";
import { ChessColor, IChessCoords } from "../../../models/chess-game/ChessCommon";
import styles from './BoardCell.module.css';

type Props = {
  playerColor: ChessColor
  pieceCoords: IChessCoords
  customClickEvent: (e: React.MouseEvent<any>, cellCoords: IChessCoords) => void
};


const BoardCell: FC<Props> = ({playerColor, pieceCoords, customClickEvent}) => {
  
  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);

  const cellSize : number = 100;
  let x : number
  let y : number

  if (playerColor === ChessColor.white) {
    x = cellSize * pieceCoords.letterCoord
    y = cellSize * (7 - pieceCoords.numberCoord)
  } else {
    x = cellSize * (7 - pieceCoords.letterCoord)
    y = cellSize * pieceCoords.numberCoord
  }



  useEffect(() => {
    const actualStyle: React.CSSProperties = {
      left: `${x}px`,
      top: `${y}px`,
      opacity: '1'
    };

    setMyStyle(actualStyle);
  },[]);

  return (
    <div className={styles.boardCell} style={myStyle} onClick={ (e) => customClickEvent(e, pieceCoords)}>
      <div className={styles.dot}/>
    </div>

  )
}
export default BoardCell;
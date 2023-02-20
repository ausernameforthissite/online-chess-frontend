import React, { Children, FC, Fragment, useEffect, useState } from "react";
import { ChessColor, IChessCoords } from "../../models/chess-game/ChessCommon";
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
  let scale : number

  if (playerColor === ChessColor.white) {
    scale = 1
    x = cellSize * pieceCoords.letterCoord
    y = cellSize * (7 - pieceCoords.numberCoord)
  } else {
    scale = 1
    x = cellSize * (7 - pieceCoords.letterCoord)
    y = cellSize * pieceCoords.numberCoord
  }



  useEffect(() => {
    const actualStyle: React.CSSProperties = {
      // transform: `translate(${x}px, ${y}px) scaleY(${scale})`
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
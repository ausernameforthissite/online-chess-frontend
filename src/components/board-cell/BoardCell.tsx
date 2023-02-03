import React, { Children, FC, Fragment, useEffect, useState } from "react";
import { ChessColor, IChessCoords } from "../../models/chess-game/ChessCommon";
import { PossibleMoveCell } from "../../models/chess-game/PossibleMoveCell";
import styles from './BoardCell.module.css';

type Props = {
  playerColor: ChessColor
  pieceCoords: IChessCoords
  customClickEvent?: (e: React.MouseEvent<any>) => void
};


const BoardCell: FC<Props> = ({playerColor, pieceCoords, customClickEvent}) => {
  
  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);

  const cellSize : number = 100;
  let x : number
  let y : number
  let scale : number


  useEffect(() => {
    if (playerColor === ChessColor.white) {
      scale = 1
      x = cellSize * pieceCoords.letterCoord
      y = cellSize * (7 - pieceCoords.numberCoord)
    } else {
      scale = -1
      x = cellSize * pieceCoords.letterCoord
      y = cellSize * (7 - pieceCoords.numberCoord)
    }

    const actualStyle: React.CSSProperties = {
      transform: `translate(${x}px, ${y}px) scaleY(${scale})`,
    };

    setMyStyle(actualStyle);
  },[]);

  return (
    <div className={styles.BoardCell} style={myStyle}>
      <div className={styles.dot}/>
    </div>

  )
}
export default BoardCell;
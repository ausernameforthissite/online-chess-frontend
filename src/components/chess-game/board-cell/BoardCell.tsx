import React, { FC, useEffect, useState } from "react";
import { ChessColor, IChessCoords } from "../../../models/chess-game/ChessCommon";
import { IBoardCell } from "../../../models/chess-game/IBoardCell";
import styles from './BoardCell.module.css';

type Props = {
  playerColor: ChessColor
  boardCell: IBoardCell
  cellCoords: IChessCoords
  customClickEvent?: (e: React.MouseEvent<any>, cellCoords: IChessCoords) => void
};


const BoardCell: FC<Props> = ({playerColor, boardCell, cellCoords, customClickEvent}) => {
  
  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);

  const cellSize : number = 100;
  let x : number
  let y : number

  if (playerColor === ChessColor.white) {
    x = cellSize * cellCoords.letterCoord
    y = cellSize * (7 - cellCoords.numberCoord)
  } else {
    x = cellSize * (7 - cellCoords.letterCoord)
    y = cellSize * cellCoords.numberCoord
  }



  useEffect(() => {
    let backgroundColor: string = "";

    if (boardCell.lastMove) {
      backgroundColor = "rgba(30, 200, 100, 0.5)";
    }

    const actualStyle: React.CSSProperties = {
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: `${backgroundColor}`,
      opacity: '1'
    };

    setMyStyle(actualStyle);
  },[]);

  return (
    <div className={styles.boardCell} 
      style={myStyle}
      onClick={ (e) => {
        if (customClickEvent !== undefined) {
          return customClickEvent(e, cellCoords);
        }
      }}
    >
      {boardCell.possibleMove && <div className={styles.dot}/>}
    </div>

  )
}
export default BoardCell;
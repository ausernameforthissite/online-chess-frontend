import React, { FC, useEffect, useState } from "react";
import { ChessMoveViewStatus } from "../../../models/chess-game/ChessCommon";
import { selectCertainChessMove } from "../../../services/GameService";
import styles from './ChessMoveComponent.module.css';


type Props = {
  chessMoveString: string,
  chessMoveNumber: number,
  viewStatus: ChessMoveViewStatus
};

const ChessMoveComponent: FC<Props> = ({chessMoveString, chessMoveNumber, viewStatus}) => {

  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);

  function viewChessMove(e: React.MouseEvent) {
    e.preventDefault();

    selectCertainChessMove(chessMoveNumber);
  }

  useEffect(() => {
    let backgroundColor: string = "";

    if (viewStatus === ChessMoveViewStatus.selected) {
      backgroundColor = "rgb(30, 200, 100)";
    } else {
      backgroundColor = "rgb(211, 201, 199)";
    }
  
    const actualStyle: React.CSSProperties = {
      backgroundColor: `${backgroundColor}`
    };
    setMyStyle(actualStyle);
  }, [viewStatus])

  return (
    <div className={styles.chessMove} onClick={viewChessMove} style={myStyle}>
      {chessMoveString}
    </div>

  )
}

export default ChessMoveComponent;
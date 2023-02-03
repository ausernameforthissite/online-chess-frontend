import React, { FC, useEffect, useState } from "react";
import { ChessColor, IChessCoords } from "../../models/chess-game/ChessCommon";
import { ChessPiece, PieceViewStatus } from "../../models/chess-game/exports";
import { getChessPieceImagePath } from "../../utils/ChessGameUtils";
import styles from './ChessPiece.module.css';

type Props = {
  playerColor: ChessColor
  chessPiece: ChessPiece
  pieceCoords: IChessCoords
  customClickEvent?: (e: React.MouseEvent<any>) => void
};


const ChessPieceComponent: FC<Props> = ({playerColor, chessPiece, pieceCoords, customClickEvent}) => {
  
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

    const opacity: number = chessPiece.viewStatus === PieceViewStatus.selected ? 0.5 : 0

    const actualStyle: React.CSSProperties = {
      backgroundImage: `url("${getChessPieceImagePath(chessPiece)}")`,
      transform: `scalyY(${scale})`,
      opacity: opacity
    };

    setMyStyle(actualStyle);
  },[]);



  return (
    <img className={styles.chessPiece} onClick = {customClickEvent} src={getChessPieceImagePath(chessPiece)} alt="" style={myStyle}/>
  )
}

export default ChessPieceComponent;
import React, { FC, useEffect, useState } from "react";
import { ChessColor, IChessCoords, PieceViewStatus } from "../../../models/chess-game/ChessCommon";
import { IChessPiece } from "../../../models/chess-game/IChessPiece";
import { getChessPieceImagePath } from "../../../utils/ChessGameUtils";
import styles from './ChessPieceComponent.module.css';

type Props = {
  playerColor: ChessColor
  chessPiece: IChessPiece
  pieceCoords: IChessCoords
  customClickEvent?: (e: React.MouseEvent<any>, pieceCoords: IChessCoords) => void
};


const ChessPieceComponent: FC<Props> = ({playerColor, chessPiece, pieceCoords, customClickEvent}) => {
  
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
    let backgroundColor: string = "";

    if (chessPiece.viewStatus === PieceViewStatus.selected) {
      backgroundColor = "rgba(80, 80, 80, 0.5)";
    } else if (chessPiece.viewStatus === PieceViewStatus.underAttack) {
      backgroundColor = "rgba(80, 0, 0, 0.5)";
    }
  
    const actualStyle: React.CSSProperties = {
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: `${backgroundColor}`,
      opacity: '1'
    };
    setMyStyle(actualStyle);

  },[chessPiece]);



  return (
    <img className={styles.chessPiece}
      onClick={ (e) => {
        if (customClickEvent !== undefined) {
          return customClickEvent(e, pieceCoords);
        }
      }} 
    src={getChessPieceImagePath(chessPiece)} alt="" style={myStyle}/>
  )
}

export default ChessPieceComponent;
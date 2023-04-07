import React, { FC, useEffect, useState } from "react"
import { useAppSelector } from "../../../hooks/ReduxHooks";
import IMAGE_PATHS from "../../../images/ImagesConstants";
import { ChessColor, IChessCoords } from "../../../models/chess-game/ChessCommon";
import { BoardCellEntityEnum, IBoardCellEntity } from "../../../models/chess-game/IBoardCellEntity";
import { sendChessMove } from "../../../services/MatchService";

import ChessPieceComponent from "../chess-piece/ChessPieceComponent";
import styles from './PawnPromotionModalWindow.module.css';


type Props = {
  playerColor: ChessColor
  pieceCoords: IChessCoords
  setChessCoordsToChangeVisibility: React.Dispatch<React.SetStateAction<IChessCoords>>
};

const PawnPromotionModalWindow: FC<Props> = ({playerColor, pieceCoords, setChessCoordsToChangeVisibility}) => {

  const matchData = useAppSelector(state => state.matchData)
  
  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);

  const cellSize : number = 100;
  let letterPieceCoords: Array<IChessCoords> = [];
  let pawnPromotionPieceTypes: Array<BoardCellEntityEnum> = [BoardCellEntityEnum.knight, BoardCellEntityEnum.bishop, BoardCellEntityEnum.rook, BoardCellEntityEnum.queen];
  let x : number
  let y : number
  let colorFactorAdd: number
  let colorFactorMult: number

  let leftBoardCellLetterCoord: number

  if (pieceCoords.letterCoord <= 1) {
    leftBoardCellLetterCoord = 0;
  } else if (pieceCoords.letterCoord >= 5) {
    leftBoardCellLetterCoord = 4;
  } else {
    leftBoardCellLetterCoord = pieceCoords.letterCoord - 1;
  }


  if (playerColor === ChessColor.white) {
    x = cellSize * leftBoardCellLetterCoord
    y = cellSize * (7 - pieceCoords.numberCoord) 
    colorFactorAdd = 0
    colorFactorMult = 1
  } else {
    x = cellSize * (4 - leftBoardCellLetterCoord) 
    y = cellSize * pieceCoords.numberCoord 
    colorFactorAdd = 7
    colorFactorMult = -1
  }

  for (let i: number = 0; i < 4; i++) {
    letterPieceCoords.push({numberCoord: pieceCoords.numberCoord, letterCoord: colorFactorAdd + colorFactorMult*i})
  }


  useEffect(() => {
    const actualStyle: React.CSSProperties = {
      transform: `translate(${x}px, ${y}px)`,
      backgroundImage: `url("${IMAGE_PATHS.chessField}")`,
    };
    setMyStyle(actualStyle);
  },[]);


  function makeChessMove(e: React.MouseEvent<any>, pawnPromotionPieceCoords: IChessCoords): void {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (matchData.match && !matchData.sendingChessMove) {

        const endPiece: IBoardCellEntity = matchData.match.boardState[pieceCoords.numberCoord][pieceCoords.letterCoord] as IBoardCellEntity
        let pawnPromotionPieceLetterCoord: number = pawnPromotionPieceCoords.letterCoord;
        let i: number = (pawnPromotionPieceLetterCoord - colorFactorAdd) / colorFactorMult


        let endPieceType: BoardCellEntityEnum | null = null;

        if (endPiece.type !== BoardCellEntityEnum.boardCell) {
          endPieceType = endPiece.type
        }

        sendChessMove({endPiece: endPieceType, endCoords: pieceCoords, pawnPromotionPiece: pawnPromotionPieceTypes[i]})
  
      } else {
        throw new Error("match was not found");
      }
    } finally {
      setChessCoordsToChangeVisibility({numberCoord: -1, letterCoord: -1});
    }
  }

  
  function closeModalWindow(e: React.MouseEvent<any>): void {
    setChessCoordsToChangeVisibility({numberCoord: -1, letterCoord: -1});
  }



  return (
    <div className={styles.wrapper} onClick={closeModalWindow}>
      <div className={styles.pawnPromotionModalWindow} style={myStyle}>
        {letterPieceCoords.map((pieceCoords, i) => {
            return <ChessPieceComponent key={i} playerColor={playerColor} chessPiece={{type: pawnPromotionPieceTypes[i], color: playerColor}} pieceCoords={pieceCoords} customClickEvent={makeChessMove}/>
          })}
      </div>
    </div>
  )

}

export default PawnPromotionModalWindow
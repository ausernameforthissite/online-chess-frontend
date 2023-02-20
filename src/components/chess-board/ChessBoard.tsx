import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks";
import CHESS_MATCH from "../../images/ImagesConstants";
import { ChessColor } from "../../models/chess-game/ChessCommon";
import { matchSlice } from "../../store/reducers/MatchReducer";
import styles from './ChessBoard.module.css';


type Props = {
  children: any,
  playerColor: ChessColor
};

const ChessBoard: FC<Props> = ({children}) => {

  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);
  const matchData = useAppSelector(state => state.matchData)
  const dispatch = useAppDispatch();

  useEffect(() => {
    const actualStyle: React.CSSProperties = {
      backgroundImage: `url("${CHESS_MATCH.chessField}")`,
    };

    setMyStyle(actualStyle);
  }, [])

  function resetBoardState(e: React.MouseEvent) {
    e.preventDefault();

    if (matchData.pieceSelected && !matchData.sendingChessMove) {
      dispatch(matchSlice.actions.resetBoardState());
    }
  }

  return (
    <div className={styles.chessBoard} style={myStyle} onClick={(e) => resetBoardState(e)}>
      {children}
    </div>
  )
}

export default ChessBoard;
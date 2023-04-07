import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/ReduxHooks";
import IMAGE_PATHS from "../../../images/ImagesConstants";
import { matchSlice } from "../../../store/reducers/MatchReducer";
import styles from './ChessBoard.module.css';


type Props = {
  children: any,
};

const ChessBoard: FC<Props> = ({children}) => {

  const defaultStyle: React.CSSProperties = {};
  const [myStyle, setMyStyle] = useState(defaultStyle);
  const matchData = useAppSelector(state => state.matchData)
  const dispatch = useAppDispatch();

  useEffect(() => {
    const actualStyle: React.CSSProperties = {
      backgroundImage: `url("${IMAGE_PATHS.chessField}")`,
    };

    setMyStyle(actualStyle);
  }, [])

  function resetBoardState(e: React.MouseEvent) {
    e.preventDefault();

    if (matchData.pieceSelected && !matchData.sendingChessMove) {
      dispatch(matchSlice.actions.clearBoardState());
    }
  }

  return (
    <div className={styles.chessBoard} style={myStyle} onClick={(e) => resetBoardState(e)}>
      {children}
    </div>
  )
}

export default ChessBoard;
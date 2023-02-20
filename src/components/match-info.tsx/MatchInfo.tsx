import React, { FC, useEffect, useState } from "react";
import {  useAppSelector } from "../../hooks/ReduxHooks";
import { ChessColor, ChessMoveViewStatus } from "../../models/chess-game/ChessCommon";
import { getColorByUsername, getUsernameByColor } from "../../models/chess-game/IUsersInMatch";
import ChessMoveComponent from "../chess-move/ChessMoveComponent";
import styles from './MatchInfo.module.css';




const MatchInfo: FC = () => {

  const matchData = useAppSelector(state => state.matchData)
  const matchRecordString = matchData.matchRecordString
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const defaultNumberArray: Array<number> = []
  const [moveNumberArray, setMoveNumberArray] = useState(defaultNumberArray);


  useEffect(() => {
    
    if (matchRecordString && matchData.match) {
      setMoveNumberArray(Array((matchRecordString.length + matchRecordString.length % 2) / 2).fill(0).map((e,i)=>i+1));
    
      if (matchData.myColor === ChessColor.white) {
        setPlayer1(getUsernameByColor(matchData.match.usersInMatch, ChessColor.black));
        setPlayer2(getUsernameByColor(matchData.match.usersInMatch, ChessColor.white));
      } else {
        setPlayer1(getUsernameByColor(matchData.match.usersInMatch, ChessColor.white));
        setPlayer2(getUsernameByColor(matchData.match.usersInMatch, ChessColor.black));
      }
      
    }
  }, [matchRecordString])

  return (
    <div className={styles.matchInfo}>
      <div className={styles.player}>{player1}</div>
      <div>Match history</div>
      <div className={styles.chessMovesWithIndex}>
        <div className={styles.index}>
          {moveNumberArray.map((index) => {
            return <div className={styles.indexContent} key={index}>{index}</div>
          })}
        </div>
        <div className={styles.chessMoves}>
          {matchRecordString && matchRecordString.map((chessMoveString, chessMoveNumber) => {
            const viewStatus: ChessMoveViewStatus = chessMoveNumber === matchData.viewedMove ? ChessMoveViewStatus.selected : ChessMoveViewStatus.default;
            return <ChessMoveComponent key={chessMoveNumber} chessMoveString={chessMoveString} chessMoveNumber={chessMoveNumber} viewStatus={viewStatus}/>
          })}
        </div>
      </div>
      <div>
        <button>Draw</button>
        <button>Surrender</button>
      </div>
      <div className={styles.player}>{player2}</div>
    </div>
  )
}

export default MatchInfo;
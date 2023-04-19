import React, { FC, Fragment, useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/ReduxHooks";
import { ChessColor, getInvertedColor, ChessMoveViewStatus } from "../../../models/chess-game/ChessCommon";
import { handleDrawOffer, offerDraw, surrender } from "../../../services/MatchService";
import { getMatchResultString } from "../../../utils/ChessGameUtils";
import MyButton from "../../my-button/MyButton";
import ChessMoveComponent from "../chess-move/ChessMoveComponent";
import DrawSurrenderButton from "../draw-surrender-button/DrawSurrenderButton";
import IncomingDrawButton from "../incoming-draw-button/IncomingDrawButton";
import FirstMoveTimer from "./first-move-timer/FirstMoveTimer";
import MainTimer from "./main-timer/MainTimer";
import styles from './MatchInfo.module.css';
import PlayerInfoSelector from "./player-info-selector/PlayerInfoSelector";
import PlayerLeftGame from "./player-left-game/PlayerLeftGame";



export type InternalComponentsProps = {
  userColor: ChessColor
}


const MatchInfo: FC = () => {

  const matchData = useAppSelector(state => state.matchData)
  const matchRecordString = matchData.matchRecordString

  const defaultNumberArray: Array<number> = []
  const [moveNumberArray, setMoveNumberArray] = useState(defaultNumberArray);


  useEffect(() => {
    
    if (matchRecordString && matchData.match) {
      setMoveNumberArray(Array((matchRecordString.length + matchRecordString.length % 2) / 2).fill(0).map((e,i)=>i+1));
    }

  }, [matchRecordString]);


  const makeDrawOffer = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    offerDraw();
  }

  const makeSurrenderOffer = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    surrender();
  }

  const handleIncomingDraw = (e: React.MouseEvent<HTMLElement>, accept?: boolean) => {
    e.preventDefault();

    if (accept !== undefined) {
      handleDrawOffer(accept);
    }
  }

  return (
    <Fragment>
      {matchData.match && matchData.matchRecord && matchData.matchRecordString &&
        <div className={styles.matchInfoWithTimers}>

           <MainTimer userColor={getInvertedColor(matchData.myColor)}/>
          <FirstMoveTimer userColor={getInvertedColor(matchData.myColor)}/>
    
           <div className={styles.matchInfo}>
            <PlayerInfoSelector userColor={getInvertedColor(matchData.myColor)}/>

            <div className={styles.chessMovesWithIndex}>
              <div className={styles.index}>
                {moveNumberArray.map((index) => {
                  return  <div className={styles.indexContainer} key={index}>
                            <span>{index}</span>
                          </div>
                })}
              </div>
              <div className={styles.chessMoves}>
                {matchData.matchRecordString.map((chessMoveString, chessMoveNumber) => {
                  const viewStatus: ChessMoveViewStatus = chessMoveNumber === matchData.viewedMoveNumber ? ChessMoveViewStatus.selected
                                                                                                    : ChessMoveViewStatus.default;
                  return <ChessMoveComponent key={chessMoveNumber} chessMoveString={chessMoveString} chessMoveNumber={chessMoveNumber} viewStatus={viewStatus}/>
                })}
              </div>
            </div>

            {!matchData.activeMatch && matchData.match.result &&
              <div className={styles.messageContainer  + " " + styles.resultBlock}>
                <span className={styles.resultFirstTextLine}>{getMatchResultString(matchData.match.result)}</span>
                <span>{matchData.match.result.message}</span>
              </div>
            }

            {matchData.activeMatch &&
              <Fragment>
                <PlayerLeftGame userColor={getInvertedColor(matchData.myColor)}/>
                {!matchData.myMatch && <PlayerLeftGame userColor={matchData.myColor}/>}

                {matchData.drawOfferReceived &&
                  <div className={styles.messageContainer + " " + styles.incomingDrawBlock}>
                    <div className={styles.incomingDrawText}>{matchData.myColor === ChessColor.white ? "Чёрные" : "Белые"} предлагают ничью</div>
                    <Fragment>
                      {matchData.myMatch && !matchData.incomingDrawHandled &&
                        <div className={styles.incomingDrawButtons}>
                          <MyButton makeAction={handleIncomingDraw} accept={true}>Принять</MyButton>
                          <MyButton makeAction={handleIncomingDraw} accept={false}>Отклонить</MyButton>
                        </div>
                      }
                    </Fragment>
                  </div>
                }

                {matchData.myMatch && matchData.matchRecord.length > 1 &&
                  <div className={styles.messageContainer + " " + styles.drawSurrenderBlock}>
                    <div className={styles.drawButtonContainer}>
                      {!matchData.offeringDraw && !matchData.drawOfferReceived && (matchData.lastMoveNumber + 1) >= matchData.nextPossibleDrawOfferSendMoveNumber &&
                        <MyButton makeAction={makeDrawOffer}>Предложить ничью</MyButton>
                      }
                    </div>

                    <div className={styles.spaceBetweenButtons}></div>

                    <div className={styles.surrenderButtonContainer}>
                      <MyButton makeAction={makeSurrenderOffer}>Сдаться</MyButton>
                    </div>
                  </div>
                }
              </Fragment>
            }
            
            <PlayerInfoSelector userColor={matchData.myColor}/>
          </div>

          <FirstMoveTimer userColor={matchData.myColor}/>
          <MainTimer userColor={matchData.myColor}/> 
        </div>
      } 
    </Fragment>
  )
}


export default MatchInfo;
import React, { FC, Fragment, useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/ReduxHooks";
import { ChessColor, getInvertedColor, ChessMoveViewStatus } from "../../../models/chess-game/ChessCommon";
import { handleDrawOffer, offerDraw, surrender } from "../../../services/GameService";
import { getGameResultString } from "../../../utils/ChessGameUtils";
import MyButton from "../../my-button/MyButton";
import ChessMoveComponent from "../chess-move/ChessMoveComponent";
import FirstMoveTimer from "./first-move-timer/FirstMoveTimer";
import MainTimer from "./main-timer/MainTimer";
import styles from './GameInfo.module.css';
import PlayerInfoSelector from "./player-info-selector/PlayerInfoSelector";
import PlayerLeftGame from "./player-left-game/PlayerLeftGame";



export type InternalComponentsProps = {
  userColor: ChessColor
}


const GameInfo: FC = () => {

  const gameData = useAppSelector(state => state.gameData)
  const gameRecordString = gameData.gameRecordString

  const defaultNumberArray: Array<number> = []
  const [moveNumberArray, setMoveNumberArray] = useState(defaultNumberArray);


  useEffect(() => {
    
    if (gameRecordString && gameData.game) {
      setMoveNumberArray(Array((gameRecordString.length + gameRecordString.length % 2) / 2).fill(0).map((e,i)=>i+1));
    }

  }, [gameRecordString]);


  const makeDrawOffer = () => {
    offerDraw();
  }

  const makeSurrenderOffer = () => {
    surrender();
  }

  const handleIncomingDraw = (accept?: boolean) => {
    if (accept !== undefined) {
      handleDrawOffer(accept);
    }
  }

  return (
    <Fragment>
      {gameData.game && gameData.gameRecord && gameData.gameRecordString &&
        <div className={styles.gameInfoWithTimers}>

           <MainTimer userColor={getInvertedColor(gameData.myColor)}/>
          <FirstMoveTimer userColor={getInvertedColor(gameData.myColor)}/>
    
           <div className={styles.gameInfo}>
            <PlayerInfoSelector userColor={getInvertedColor(gameData.myColor)}/>

            <div className={styles.chessMovesWithIndex}>
              <div className={styles.index}>
                {moveNumberArray.map((index) => {
                  return  <div className={styles.indexContainer} key={index}>
                            <span>{index}</span>
                          </div>
                })}
              </div>
              <div className={styles.chessMoves}>
                {gameData.gameRecordString.map((chessMoveString, chessMoveNumber) => {
                  const viewStatus: ChessMoveViewStatus = chessMoveNumber === gameData.viewedMoveNumber ? ChessMoveViewStatus.selected
                                                                                                    : ChessMoveViewStatus.default;
                  return <ChessMoveComponent key={chessMoveNumber} chessMoveString={chessMoveString} chessMoveNumber={chessMoveNumber} viewStatus={viewStatus}/>
                })}
              </div>
            </div>

            {!gameData.activeGame && gameData.game.result &&
              <div className={styles.messageContainer  + " " + styles.resultBlock}>
                <span className={styles.resultFirstTextLine}>{getGameResultString(gameData.game.result)}</span>
                <span>{gameData.game.result.message}</span>
              </div>
            }

            {gameData.activeGame &&
              <Fragment>
                <PlayerLeftGame userColor={getInvertedColor(gameData.myColor)}/>
                {!gameData.myGame && <PlayerLeftGame userColor={gameData.myColor}/>}

                {gameData.drawOfferReceived &&
                  <div className={styles.messageContainer + " " + styles.incomingDrawBlock}>
                    <div className={styles.incomingDrawText}>{gameData.myColor === ChessColor.white ? "Чёрные" : "Белые"} предлагают ничью</div>
                    <Fragment>
                      {gameData.myGame && !gameData.incomingDrawHandled &&
                        <div className={styles.incomingDrawButtons}>
                          <MyButton makeAction={handleIncomingDraw} accept={true}>Принять</MyButton>
                          <MyButton makeAction={handleIncomingDraw} accept={false}>Отклонить</MyButton>
                        </div>
                      }
                    </Fragment>
                  </div>
                }

                {gameData.myGame && gameData.gameRecord.length > 1 &&
                  <div className={styles.messageContainer + " " + styles.drawSurrenderBlock}>
                    <div className={styles.drawButtonContainer}>
                      {!gameData.offeringDraw && !gameData.drawOfferReceived && (gameData.lastMoveNumber + 1) >= gameData.nextPossibleDrawOfferSendMoveNumber &&
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
            
            <PlayerInfoSelector userColor={gameData.myColor}/>
          </div>

          <FirstMoveTimer userColor={gameData.myColor}/>
          <MainTimer userColor={gameData.myColor}/> 
        </div>
      } 
    </Fragment>
  )
}


export default GameInfo;
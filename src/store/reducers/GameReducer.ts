import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChessColor } from '../../models/chess-game/ChessCommon'
import { ChessGameTypesType } from '../../models/chess-game/ChessGameType'
import { IChessGameResult } from '../../models/chess-game/IChessGameResult'
import { chessMoveToString, IChessMove, IChessMoveFullData } from '../../models/chess-game/IChessMove'
import { IGame } from '../../models/chess-game/IGame'
import { IWebsocketErrorDTO } from '../../models/DTO/IWebsocketErrorDTO'
import { IGetGameStateDTO } from '../../models/DTO/game/IGetGameStateDTO'
import { IMakeChessMoveDTO } from '../../models/DTO/game/IMakeChessMoveDTO'
import { ISelectChessPiece, ISelectChessPieceStart } from '../../models/DTO/game/ISelectChessPiece'
import { IUsersRatingsDataForGameResponse } from '../../models/DTO/game/IUsersRatingsDataForGameResponse'
import { IViewCertainMoveDTO } from '../../models/DTO/game/IViewCertainMoveDTO'
import { IChessGameInfoResponse } from '../../models/DTO/game/websocket/chess-game/response/IChessGameInfoResponse'
import { IChessGameUserDisconnectedResponse } from '../../models/DTO/game/websocket/chess-game/response/IChessGameUserDisconnectedResponse'
import { IFindGameOkResponse } from '../../models/DTO/game/websocket/find-game/response/IFindGameOkResponse'
import { WebsocketErrorEnum } from '../../models/DTO/game/websocket/WebsocketErrorEnum'
import { getGameStateAndSubscribeToGame } from '../../services/GameService'
import { LEFT_GAME_TIMEOUT_MS } from '../../utils/ChessGameConstants'
import { deleteSelectionFromBoardState, updateBoardState} from '../../utils/ChessGameUtils'


export type GameState = {
  gameId: string | null
  gameType: ChessGameTypesType | null
  game: IGame | null
  gameRecord: Array<IChessMoveFullData> | null
  gameRecordString: Array<string> | null
  lastMoveNumber: number
  viewedMoveNumber: number
  myColor: ChessColor
  activeGame: boolean
  myGame: boolean
  myTurn: boolean
  gameStateError: string | null

  searchStart: boolean
  searching: boolean
  searchError: string | null
  searchErrorCode: WebsocketErrorEnum | null
  searchCanceling: boolean
  searchCancelError: string | null
  searchConnectionAttemptsCount: number
  searchPageLoaded: boolean

  subscribing: boolean
  subscribed: boolean
  subscribeError: string | null
  subscribeErrorCode: WebsocketErrorEnum | null
  subscribeConnectionAttemptsCount: number

  gameLoaded: boolean

  initialTimeLeftMS: number
  initialFirstMoveTimeLeftMS: number
  initialReconnectTimeLeftMS: number

  whiteUserOnline: boolean
  whiteTimeLeftMS: number
  whiteTimerStopped: boolean
  whiteReconnectTimeLeftMS: number
  blackUserOnline: boolean
  blackTimeLeftMS: number
  blackTimerStopped: boolean
  blackReconnectTimeLeftMS: number
  whiteFirstMoveTimeLeftMS: number
  blackFirstMoveTimeLeftMS: number

  pieceSelected: boolean
  newMoveStart: ISelectChessPieceStart | null
  sendingChessMove: boolean

  nextPossibleDrawOfferSendMoveNumber: number
  offeringDraw: boolean
  drawOfferUserColor: ChessColor | null
  drawOfferReceived: boolean
  drawOfferReceivedMoveNumber: number
  incomingDrawHandled: boolean
  surrendering: boolean

  whiteRating: number
  whiteRatingChange: number | null
  blackRating: number
  blackRatingChange: number | null
}

const initialState: GameState = {
  gameId: null,
  gameType: null,
  game: null,
  gameRecord: null,
  gameRecordString: null,
  lastMoveNumber: -1,
  viewedMoveNumber: -1,
  myColor: ChessColor.white,
  activeGame: false,
  myGame: false,
  myTurn: false,
  gameStateError: null,

  searchStart: false,
  searching: false,
  searchError: null,
  searchErrorCode: null,
  searchCanceling: false,
  searchCancelError: null,
  searchConnectionAttemptsCount: 0,
  searchPageLoaded: false,

  subscribing: false,
  subscribed: false,
  subscribeError: null,
  subscribeErrorCode: null,
  subscribeConnectionAttemptsCount: 0,

  gameLoaded: false,

  initialTimeLeftMS: -1,
  initialFirstMoveTimeLeftMS: -1,
  initialReconnectTimeLeftMS: -1,

  whiteUserOnline: false,
  whiteTimeLeftMS: 0,
  whiteTimerStopped: true,
  whiteReconnectTimeLeftMS: -1,
  blackUserOnline: false,
  blackTimeLeftMS: 0,
  blackTimerStopped: true,
  blackReconnectTimeLeftMS: -1,
  whiteFirstMoveTimeLeftMS: -1,
  blackFirstMoveTimeLeftMS: -1,

  pieceSelected: false,
  newMoveStart: null,
  sendingChessMove: false,

  nextPossibleDrawOfferSendMoveNumber: 2,
  offeringDraw: false,
  drawOfferUserColor: null,
  drawOfferReceived: false,
  drawOfferReceivedMoveNumber: -1,
  incomingDrawHandled: false,
  surrendering: false,

  whiteRating: -1,
  whiteRatingChange: null,
  blackRating: -1,
  blackRatingChange: null,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    searchStart(state: GameState, action: PayloadAction<ChessGameTypesType>) {
      state.searchStart = true;
      state.gameType = action.payload;
      state.searchError = null;
      state.searchCancelError = null;
    },
    searchStartSuccess(state: GameState) {
      state.searchStart = false;
      state.searching = true;
    },
    searchSuccess(state: GameState, action: PayloadAction<IFindGameOkResponse>) {
      state.searchStart = false;
      state.searching = false;
      state.searchCanceling = false;
      state.searchCancelError = null;
      state.gameId = action.payload.gameId;
      state.activeGame = true;
    },
    searchCancelStart(state: GameState) {
      state.searchCanceling = true;
    },
    searchCanceled(state: GameState) {
      state.searchCanceling = false;
      state.searchStart = false;
      state.searching = false;
      state.searchCancelError = null;
      state.searchConnectionAttemptsCount = 0;
      state.gameType = null;
    },
    searchCancelFailure(state: GameState, action: PayloadAction<string>) {
      state.searchCancelError = action.payload;
    },
    searchFailure(state: GameState, action: PayloadAction<IWebsocketErrorDTO | undefined>) {
      state.searchStart = false;
      state.searching = false;
      state.searchCanceling = false;

      if (action.payload) {
        if (action.payload.code === WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_IN_GAME) {
          const splittedMessage: Array<string> = action.payload.message.split(" gameId = ");

          if (splittedMessage.length === 2) {
            state.gameId = splittedMessage[1];
            state.activeGame = true;
            state.searchError = action.payload.message;
            state.searchErrorCode = WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_IN_GAME;
          } else {
            state.searchError = "Некорректный ответ сервера.";
            state.searchErrorCode = WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL;
          }
        } else {
          state.searchError = action.payload.message;
          state.searchErrorCode = action.payload.code;
        }
        state.searchConnectionAttemptsCount = 0;
      }
    },
    failCurrentFindGameActions(state: GameState) {
      state.searchCanceling = false;
    },
    searchClearError(state: GameState) {
      state.searchError = null;
      state.searchCancelError = null;
      state.gameType = null;
    },
    searchIncrementConnectionCount(state: GameState) {
      state.searchConnectionAttemptsCount = state.searchConnectionAttemptsCount + 1;
    },
    searchAlreadyInGame(state: GameState, action: PayloadAction<string>) {
      state.gameId = action.payload;
      state.activeGame = true;
    },
    setSearchPageLoaded(state: GameState, action: PayloadAction<boolean>) {
      state.searchPageLoaded = action.payload;
    },
    getGameStateSuccess(state: GameState, action: PayloadAction<IGetGameStateDTO>) {
      state.game = action.payload.game
      state.gameRecord = action.payload.gameRecord
      state.gameRecordString = action.payload.gameRecordString
      state.lastMoveNumber = action.payload.gameRecord.length - 1
      state.viewedMoveNumber = action.payload.viewedMoveNumber
      state.activeGame = action.payload.activeGame
      state.myGame = action.payload.myGame
      state.myTurn = action.payload.myTurn
      state.myColor = action.payload.myColor
      state.gameId = action.payload.gameId
      state.gameStateError = null

      if (!action.payload.activeGame && action.payload.game.result) {
        state.whiteTimerStopped = true;
        state.blackTimerStopped = true;
        state.whiteTimeLeftMS = action.payload.game.result.whiteTimeLeftMS;
        state.blackTimeLeftMS = action.payload.game.result.blackTimeLeftMS
      } else if (action.payload.myGame) {
        if (action.payload.myColor === ChessColor.white) {
          state.whiteUserOnline = true;
          state.whiteReconnectTimeLeftMS = -1;
        } else {
          state.blackUserOnline = true;
          state.blackReconnectTimeLeftMS = -1;
        }
      }
    },
    getGameStateFailure(state: GameState, action: PayloadAction<string>) {
      state.gameStateError = action.payload
    },
    getUsersRatingsDataSuccess(state: GameState, action: PayloadAction<IUsersRatingsDataForGameResponse>) {
      state.whiteRating = action.payload.whiteInitialRating;
      state.blackRating = action.payload.blackInitialRating;

      if (action.payload.whiteRatingChange !== null) {
        state.whiteRatingChange = action.payload.whiteRatingChange;
      }

      if (action.payload.blackRatingChange !== null) {
        state.blackRatingChange = action.payload.blackRatingChange;
      }
    },
    subscribingStart(state: GameState) {
      state.subscribing = true
      state.subscribed = false
      state.subscribeError = null
      state.subscribeErrorCode = null
    },
    subscribeSuccess(state: GameState) {
      state.subscribing = false
      state.subscribed = true
      state.subscribeError = null
      state.subscribeErrorCode = null
    },
    subscribeFinished(state: GameState) {
      state.subscribing = false;
      state.subscribed = false;
      state.subscribeError = null;
      state.subscribeErrorCode = null;
      state.subscribeConnectionAttemptsCount = 0;
    },
    subscribeFailure(state: GameState, action: PayloadAction<IWebsocketErrorDTO | undefined>) {
      state.subscribing = false;
      state.subscribed = false;

      if (action.payload) {
        state.subscribeError = action.payload.message;
        state.subscribeErrorCode = action.payload.code;
      }
    },
    subscribeIncrementConnectionCount(state: GameState) {
      state.subscribeConnectionAttemptsCount = state.subscribeConnectionAttemptsCount + 1;
    },
    loadGameSuccess(state: GameState) {
      state.gameLoaded = true;
    },
    updateUsersInfo(state: GameState, action: PayloadAction<IChessGameInfoResponse>) {
      if (state.lastMoveNumber !== action.payload.lastMoveNumber) {
        if (state.gameId) {
          getGameStateAndSubscribeToGame(state.gameId)
          return;
        } else {
          throw new Error("There is no game id!");
        }
      }

      state.gameLoaded = true;

      state.initialTimeLeftMS = action.payload.initialTimeLeftMS;
      state.initialFirstMoveTimeLeftMS = action.payload.initialFirstMoveTimeLeftMS;
      state.initialReconnectTimeLeftMS = action.payload.initialReconnectTimeLeftMS;

      state.whiteUserOnline = action.payload.currentUsersOnlineStatusesAndTimings.whiteUserOnline;
      state.whiteTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.whiteTimeLeftMS;
      state.whiteReconnectTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.whiteReconnectTimeLeftMS;
      state.blackUserOnline = action.payload.currentUsersOnlineStatusesAndTimings.blackUserOnline;
      state.blackTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.blackTimeLeftMS;
      state.blackReconnectTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.blackReconnectTimeLeftMS;

      if (state.lastMoveNumber < 1){
        state.whiteTimerStopped = true
        state.blackTimerStopped = true

        if (action.payload.currentUsersOnlineStatusesAndTimings.userFirstMoveTimeLeftMS) {
          if (state.lastMoveNumber === -1) {
            state.whiteFirstMoveTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.userFirstMoveTimeLeftMS;
            state.blackFirstMoveTimeLeftMS = action.payload.initialFirstMoveTimeLeftMS;
          } else {
            state.blackFirstMoveTimeLeftMS = action.payload.currentUsersOnlineStatusesAndTimings.userFirstMoveTimeLeftMS;
          }
        }
      } else if (state.lastMoveNumber % 2 === 0) {
        state.whiteTimerStopped = true
        state.blackTimerStopped = false
      } else {
        state.whiteTimerStopped = false
        state.blackTimerStopped = true
      }
    },
    updateOnUserSubscribed(state: GameState, action: PayloadAction<ChessColor>) {
      if (action.payload === ChessColor.white) {
        state.whiteUserOnline = true;
        state.whiteReconnectTimeLeftMS = -1;
      } else if (action.payload === ChessColor.black) {
        state.blackUserOnline = true;
        state.blackReconnectTimeLeftMS = -1;
      }
    },
    updateOnUserDisconnected(state: GameState, action: PayloadAction<IChessGameUserDisconnectedResponse>) {
      const reconnectTimeLeftMS: number = state.lastMoveNumber < 1 ? -1 : LEFT_GAME_TIMEOUT_MS;

      if (action.payload.disconnectedUserColor === ChessColor.white) {
        state.whiteUserOnline = false;
        state.whiteReconnectTimeLeftMS = reconnectTimeLeftMS;
      } else if (action.payload.disconnectedUserColor === ChessColor.black) {
        state.blackUserOnline = false;
        state.blackReconnectTimeLeftMS = reconnectTimeLeftMS;
      }
    },
    makeChessMove(state: GameState, action: PayloadAction<IMakeChessMoveDTO>) {
      if (state.game && state.gameRecord && state.gameRecordString) {
        if (action.payload.boardState && action.payload.enPassantPawnCoords !== undefined) {
          updateBoardState(state.game.boardState, action.payload.boardState);
          state.pieceSelected = false;
          state.game.enPassantPawnCoords = action.payload.enPassantPawnCoords;
          state.viewedMoveNumber++;
        }

        state.lastMoveNumber++;

        if (state.whiteTimeLeftMS !== action.payload.chessMove.whiteTimeLeftMS) {
          state.whiteTimeLeftMS = action.payload.chessMove.whiteTimeLeftMS;
        }

        if (state.blackTimeLeftMS !== action.payload.chessMove.blackTimeLeftMS) {
          state.blackTimeLeftMS = action.payload.chessMove.blackTimeLeftMS;
        }

        if (action.payload.chessMove.moveNumber < 1){
          state.whiteTimerStopped = true
          state.blackTimerStopped = true
        } else if (action.payload.chessMove.moveNumber % 2 === 0) {
          state.whiteTimerStopped = true
          state.blackTimerStopped = false
        } else {
          state.whiteTimerStopped = false
          state.blackTimerStopped = true
        }

        if (action.payload.chessMove.moveNumber === 1 && !state.whiteUserOnline) {
          state.whiteReconnectTimeLeftMS = state.initialReconnectTimeLeftMS;
        }

        if (state.myGame) {
          state.myTurn = !state.myTurn;
        }

        state.surrendering = false;

        if (state.offeringDraw && action.payload.chessMove.moveNumber >= state.nextPossibleDrawOfferSendMoveNumber) {
          state.offeringDraw = false;
        }

        if (state.drawOfferReceived && action.payload.chessMove.moveNumber > state.drawOfferReceivedMoveNumber) {
          state.drawOfferReceived  = false;
        }

        state.gameRecord.push(action.payload.chessMove);
        state.gameRecordString.push(chessMoveToString(action.payload.chessMove));

        state.subscribeConnectionAttemptsCount = 0;
        state.sendingChessMove = false
        state.newMoveStart = null
      } else {
        throw new Error("Game or game state is not found")
      }
    },
    selectChessPiece(state: GameState, action: PayloadAction<ISelectChessPiece>) {
      if (state.game) {
        updateBoardState(state.game.boardState, action.payload.boardState);
        state.pieceSelected = true;
        state.newMoveStart = action.payload.selectChessPieceStart
      } else {
        throw new Error("Game is not found")
      }
    },
    clearBoardState(state: GameState) {
      if (state.game) {
        deleteSelectionFromBoardState(state.game.boardState)
        state.pieceSelected = false;
        state.newMoveStart = null
      } else {
        throw new Error("Game is not found")
      }
    },
    sendChessMoveStart(state: GameState) {
      state.sendingChessMove = true
    },
    sendChessMoveFailure(state: GameState) {
      state.sendingChessMove = false
    },
    viewCertainChessMove(state: GameState, action: PayloadAction<IViewCertainMoveDTO>) {
      if (state.game && state.gameRecord && state.gameRecordString) {
        updateBoardState(state.game.boardState, action.payload.boardState);
        state.pieceSelected = false;
        state.newMoveStart = null
        state.viewedMoveNumber = action.payload.moveNumber;
        state.game.enPassantPawnCoords = action.payload.enPassantPawnCoords;
      } else {
        throw new Error("Game or game record is not found");
      }
    },
    offerDrawStart(state: GameState) {
      state.offeringDraw = true;
    },
    offerDrawSuccess(state: GameState) {
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 2;
    },
    offerDrawFailure(state: GameState) {
      if (state.offeringDraw) {
        state.offeringDraw = false;
      }
    },
    offerDrawRejected(state: GameState) {
      state.offeringDraw = false;
    },
    receiveDrawOffer(state: GameState, action: PayloadAction<ChessColor>) {
      state.drawOfferReceived = true;
      state.incomingDrawHandled = false;
      state.drawOfferUserColor = action.payload;
      state.drawOfferReceivedMoveNumber = state.lastMoveNumber + 1;
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 2;
    },
    handleIncomingDrawOfferStart(state: GameState) {
      state.incomingDrawHandled = true;
    },
    handleIncomingDrawOfferFinish(state: GameState) {
      state.drawOfferReceived = false;
      state.incomingDrawHandled = true;
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 1;
    },
    handleIncomingDrawOfferFailure(state: GameState) {
      state.incomingDrawHandled = false;
    },
    surrenderStart(state: GameState) {
      state.surrendering = true
    },
    surrenderFailure(state: GameState) {
      state.surrendering = false
    },
    finishChessGame(state: GameState, action: PayloadAction<IChessGameResult>) {
      if (state.game) {
        state.myTurn = false
        state.activeGame = false
        state.game.result = action.payload
        state.offeringDraw = false
        state.drawOfferReceived = false
        state.incomingDrawHandled = false
        state.surrendering = false
        state.whiteTimerStopped = true;
        state.blackTimerStopped = true;
        
        if (state.whiteTimeLeftMS !== action.payload.whiteTimeLeftMS) {
          state.whiteTimeLeftMS = action.payload.whiteTimeLeftMS;
        }

        if (state.blackTimeLeftMS !== action.payload.blackTimeLeftMS) {
          state.blackTimeLeftMS = action.payload.blackTimeLeftMS;
        }
      } else {
        throw new Error("Game is not found")
      }
    },
    failCurrentChessGameActions(state: GameState) {
      state.sendingChessMove = false;
      state.surrendering = false
    },
    clearGameState() {
      return initialState;
    }
  }
})


export default gameSlice.reducer;
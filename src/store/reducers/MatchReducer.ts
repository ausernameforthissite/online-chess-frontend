import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChessColor } from '../../models/chess-game/ChessCommon'
import { IChessMatchResult } from '../../models/chess-game/IChessMatchResult'
import { chessMoveToString, IChessMove, IChessMoveFullData } from '../../models/chess-game/IChessMove'
import { IMatch } from '../../models/chess-game/IMatch'
import { IGetMatchStateDTO } from '../../models/DTO/match/IGetMatchStateDTO'
import { IMakeChessMoveDTO } from '../../models/DTO/match/IMakeChessMoveDTO'
import { ISelectChessPiece, ISelectChessPieceStart } from '../../models/DTO/match/ISelectChessPiece'
import { IUsersRatingsDataForMatchResponse } from '../../models/DTO/match/IUsersRatingsDataForMatchResponse'
import { IViewCertainMoveDTO } from '../../models/DTO/match/IViewCertainMoveDTO'
import { IChessMatchInfoResponse } from '../../models/DTO/match/websocket/chess-match/response/IChessMatchInfoResponse'
import { IChessMatchUserDisconnectedResponse } from '../../models/DTO/match/websocket/chess-match/response/IChessMatchUserDisconnectedResponse'
import { IFindMatchOkResponse } from '../../models/DTO/match/websocket/find-match/response/IFindMatchOkResponse'
import { getMatchStateAndSubscribeToMatch } from '../../services/MatchService'
import { LEFT_GAME_TIMEOUT_MS } from '../../utils/ChessGameConstants'
import { deleteSelectionFromBoardState, updateBoardState} from '../../utils/ChessGameUtils'


export type MatchState = {
  matchId: number
  match: IMatch | null
  matchRecord: Array<IChessMoveFullData> | null
  matchRecordString: Array<string> | null
  lastMoveNumber: number
  viewedMoveNumber: number
  myColor: ChessColor
  activeMatch: boolean
  myMatch: boolean
  myTurn: boolean
  matchStateError: string | null

  searchWindowView: boolean
  searchStart: boolean
  searching: boolean
  searchError: string | null
  searchCanceling: boolean
  searchCancelError: string | null

  subscribing: boolean
  subscribed: boolean
  subscribeError: string | null

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

const initialState: MatchState = {
  matchId: -1,
  match: null,
  matchRecord: null,
  matchRecordString: null,
  lastMoveNumber: -1,
  viewedMoveNumber: -1,
  myColor: ChessColor.white,
  activeMatch: false,
  myMatch: false,
  myTurn: false,
  matchStateError: null,

  searchWindowView: false,
  searchStart: false,
  searching: false,
  searchError: null,
  searchCanceling: false,
  searchCancelError: null,

  subscribing: false,
  subscribed: false,
  subscribeError: null,

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

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    searchStart(state: MatchState) {
      state.searchWindowView = true;
      state.searchStart = true;
      state.searchError = null;
      state.searchCancelError = null;
    },
    searchStartSuccess(state: MatchState) {
      state.searching = true;
    },
    searchSuccess(state: MatchState, action: PayloadAction<IFindMatchOkResponse>){
      state.searchWindowView = false;
      state.searchStart = false;
      state.searching = false;
      state.searchCanceling = false;
      state.searchCancelError = null;
      state.matchId = action.payload.matchId;
    },
    searchCancelStart(state: MatchState){
      state.searchCanceling = true;
      state.searchCancelError = null;
    },
    searchCanceled(state: MatchState){
      state.searchWindowView = false;
      state.searchCanceling = false;
      state.searchStart = false;
      state.searching = false;
    },
    searchCancelFailure(state: MatchState, action: PayloadAction<string>){
      state.searchCancelError = action.payload
    },
    searchFailure(state: MatchState, action: PayloadAction<string>){
      state.searchStart = false
      state.searching = false
      state.searchCanceling = false
      state.searchError = action.payload
    },
    searchAlreadyInMatch(state: MatchState, action: PayloadAction<number>){
      state.matchId = action.payload
      state.activeMatch = true
    },
    searchWindowViewFalse(state: MatchState) {
      state.searchWindowView = false
    },
    getMatchStateSuccess(state: MatchState, action: PayloadAction<IGetMatchStateDTO>){
      state.match = action.payload.match
      state.matchRecord = action.payload.matchRecord
      state.matchRecordString = action.payload.matchRecordString
      state.lastMoveNumber = action.payload.matchRecord.length - 1
      state.viewedMoveNumber = action.payload.viewedMoveNumber
      state.activeMatch = action.payload.activeMatch
      state.myMatch = action.payload.myMatch
      state.myTurn = action.payload.myTurn
      state.myColor = action.payload.myColor
      state.matchId = action.payload.matchId
      state.matchStateError = null

      if (!action.payload.activeMatch && action.payload.match.result) {
        state.whiteTimerStopped = true;
        state.blackTimerStopped = true;
        state.whiteTimeLeftMS = action.payload.match.result.whiteTimeLeftMS;
        state.blackTimeLeftMS = action.payload.match.result.blackTimeLeftMS
      } else if (action.payload.myMatch) {
        if (action.payload.myColor === ChessColor.white) {
          state.whiteUserOnline = true;
          state.whiteReconnectTimeLeftMS = -1;
        } else {
          state.blackUserOnline = true;
          state.blackReconnectTimeLeftMS = -1;
        }
      }
    },
    getMatchStateFailure(state: MatchState, action: PayloadAction<string>){
      state.matchStateError = action.payload
    },
    getUsersRatingsDataSuccess(state: MatchState, action: PayloadAction<IUsersRatingsDataForMatchResponse>){
      state.whiteRating = action.payload.whiteInitialRating;
      state.blackRating = action.payload.blackInitialRating;

      if (action.payload.whiteRatingChange !== null) {
        state.whiteRatingChange = action.payload.whiteRatingChange;
      }

      if (action.payload.blackRatingChange !== null) {
        state.blackRatingChange = action.payload.blackRatingChange;
      }
    },
    subscribingStart(state: MatchState){
      state.subscribing = true
      state.subscribed = false
    },
    subscribeSuccess(state: MatchState){
      state.subscribing = false
      state.subscribed = true
      state.subscribeError = null
    },
    subscribeFinished(state: MatchState){
      state.subscribing = false
      state.subscribed = false
    },
    subscribeFailure(state: MatchState, action: PayloadAction<string>){
      state.subscribing = false
      state.subscribed = false
      state.subscribeError = action.payload
    },
    updateUsersInfo(state: MatchState, action: PayloadAction<IChessMatchInfoResponse>){
      if (state.lastMoveNumber !== action.payload.lastMoveNumber) {
        if (state.matchId > 0) {
          getMatchStateAndSubscribeToMatch(state.matchId)
          return;
        } else {
          throw new Error("There is no match id!");
        }
      }

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
    updateOnUserSubscribed(state: MatchState, action: PayloadAction<ChessColor>){
      if (action.payload === ChessColor.white) {
        state.whiteUserOnline = true;
        state.whiteReconnectTimeLeftMS = -1;
      } else if (action.payload === ChessColor.black) {
        state.blackUserOnline = true;
        state.blackReconnectTimeLeftMS = -1;
      }
    },
    updateOnUserDisconnected(state: MatchState, action: PayloadAction<IChessMatchUserDisconnectedResponse>){
      const reconnectTimeLeftMS: number = state.lastMoveNumber < 1 ? -1 : LEFT_GAME_TIMEOUT_MS;

      if (action.payload.disconnectedUserColor === ChessColor.white) {
        state.whiteUserOnline = false;
        state.whiteReconnectTimeLeftMS = reconnectTimeLeftMS;
      } else if (action.payload.disconnectedUserColor === ChessColor.black) {
        state.blackUserOnline = false;
        state.blackReconnectTimeLeftMS = reconnectTimeLeftMS;
      }
    },
    makeChessMove(state: MatchState, action: PayloadAction<IMakeChessMoveDTO>){
      if (state.match && state.matchRecord && state.matchRecordString) {
        if (action.payload.boardState && action.payload.enPassantPawnCoords !== undefined) {
          updateBoardState(state.match.boardState, action.payload.boardState);
          state.pieceSelected = false;
          state.match.enPassantPawnCoords = action.payload.enPassantPawnCoords;
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

        if (state.myMatch) {
          state.myTurn = !state.myTurn;
        }

        state.surrendering = false;

        if (state.offeringDraw && action.payload.chessMove.moveNumber >= state.nextPossibleDrawOfferSendMoveNumber) {
          state.offeringDraw = false;
        }

        if (state.drawOfferReceived && action.payload.chessMove.moveNumber > state.drawOfferReceivedMoveNumber) {
          state.drawOfferReceived  = false;
        }

        state.matchRecord.push(action.payload.chessMove);
        state.matchRecordString.push(chessMoveToString(action.payload.chessMove));

        state.sendingChessMove = false
        state.newMoveStart = null
      } else {
        throw new Error("Match or match state is not found found")
      }
    },
    selectChessPiece(state: MatchState, action: PayloadAction<ISelectChessPiece>) {
      if (state.match) {
        updateBoardState(state.match.boardState, action.payload.boardState);
        state.pieceSelected = true;
        state.newMoveStart = action.payload.selectChessPieceStart
      } else {
        throw new Error("Match is not found")
      }
    },
    clearBoardState(state: MatchState) {
      if (state.match) {
        deleteSelectionFromBoardState(state.match.boardState)
        state.pieceSelected = false;
        state.newMoveStart = null
      } else {
        throw new Error("Match is not found")
      }
    },
    sendChessMoveStart(state: MatchState, action: PayloadAction<IChessMove>){
      state.sendingChessMove = true
    },
    sendChessMoveFailure(state: MatchState){
      state.sendingChessMove = false
    },
    viewCertainChessMove(state: MatchState, action: PayloadAction<IViewCertainMoveDTO>) {
      if (state.match && state.matchRecord && state.matchRecordString) {
        updateBoardState(state.match.boardState, action.payload.boardState);
        state.pieceSelected = false;
        state.newMoveStart = null
        state.viewedMoveNumber = action.payload.moveNumber;
        state.match.enPassantPawnCoords = action.payload.enPassantPawnCoords;
      } else {
        throw new Error("Match or match record is not found");
      }
    },
    offerDrawStart(state: MatchState){
      state.offeringDraw = true;
    },
    offerDrawSuccess(state: MatchState){
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 2;
    },
    offerDrawFailure(state: MatchState){
      if (state.offeringDraw) {
        state.offeringDraw = false;
      }
    },
    offerDrawRejected(state: MatchState){
      state.offeringDraw = false;
    },
    receiveDrawOffer(state: MatchState, action: PayloadAction<ChessColor>){
      state.drawOfferReceived = true;
      state.incomingDrawHandled = false;
      state.drawOfferUserColor = action.payload;
      state.drawOfferReceivedMoveNumber = state.lastMoveNumber + 1;
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 2;
    },
    handleIncomingDrawOfferStart(state: MatchState){
      state.incomingDrawHandled = true;
    },
    handleIncomingDrawOfferFinish(state: MatchState){
      state.drawOfferReceived = false;
      state.incomingDrawHandled = true;
      state.nextPossibleDrawOfferSendMoveNumber = (state.lastMoveNumber + 1) + 1;
    },
    handleIncomingDrawOfferFailure(state: MatchState){
      state.incomingDrawHandled = false;
    },
    surrenderStart(state: MatchState){
      state.surrendering = true
    },
    surrenderFailure(state: MatchState){
      state.surrendering = false
    },
    finishChessMatch(state: MatchState, action: PayloadAction<IChessMatchResult>){
      if (state.match) {
        state.myTurn = false
        state.activeMatch = false
        state.match.result = action.payload
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
        throw new Error("Match is not found")
      }
    },
  }
})


export default matchSlice.reducer;
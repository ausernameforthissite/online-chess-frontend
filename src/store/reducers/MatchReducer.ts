import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChessColor } from '../../models/chess-game/ChessCommon'
import { chessMoveToString, IChessMoveFullData } from '../../models/chess-game/IChessMove'
import { IMatch } from '../../models/chess-game/IMatch'
import { IFindMatchResponse } from '../../models/DTO/match/IFindMatchResponse'
import { IGetMatchStateDTO } from '../../models/DTO/match/IGetMatchStateDTO'
import { IMakeChessMoveDTO } from '../../models/DTO/match/IMakeChessMoveDTO'
import { ISelectChessPiece, ISelectChessPieceStart } from '../../models/DTO/match/ISelectChessPiece'
import { IViewCertainMoveDTO } from '../../models/DTO/match/IViewCertainMoveDTO'
import { deleteSelectionFromBoardState, updateBoardState} from '../../utils/ChessGameUtils'
import store from '../store'

var deepEqual = require('deep-equal')

type MatchState = {
  matchId: number
  match: IMatch | null
  matchRecord: Array<IChessMoveFullData> | null
  matchRecordString: Array<string> | null
  viewedMove: number
  myColor: ChessColor

  searching: boolean
  activeMatch: boolean
  myMatch: boolean
  subscribed: boolean

  myTurn: boolean
  pieceSelected: boolean
  newMoveStart: ISelectChessPieceStart | null
  sendingChessMove: boolean

  error:  string | null
}

const initialState: MatchState = {
  matchId: -1,
  match: null,
  matchRecord: null,
  matchRecordString: null,
  viewedMove: -1,
  myColor: ChessColor.white,

  searching: false,
  activeMatch: false,
  myMatch: false,
  subscribed: false,

  myTurn: false,
  pieceSelected: false,
  newMoveStart: null,
  sendingChessMove: false,

  error:  null
}

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    searchStart(state: MatchState) {
      state.searching = true
      state.error = null
    },
    searchSuccess(state: MatchState, action: PayloadAction<IFindMatchResponse>){
      state.searching = false
      state.matchId = action.payload.matchId
    },
    searchFailure(state: MatchState, action: PayloadAction<string>){
      state.searching = false
      state.error = action.payload
    },
    subscribeSuccess(state: MatchState){
      state.subscribed = true
    },
    subscribeFinished(state: MatchState){
      state.subscribed = false
    },
    subscribeFailure(state: MatchState, action: PayloadAction<string>){
      state.error = action.payload
      state.subscribed = false
    },
    getMatchStateSuccess(state: MatchState, action: PayloadAction<IGetMatchStateDTO>){
      state.match = action.payload.match
      state.matchRecord = action.payload.matchRecord
      state.matchRecordString = action.payload.matchRecordString
      state.viewedMove = action.payload.viewedMove
      state.activeMatch = action.payload.activeMatch
      state.myMatch = action.payload.myMatch
      state.myTurn = action.payload.myTurn
      state.myColor = action.payload.myColor
      state.matchId = action.payload.matchId
    },
    getMatchStateFailure(state: MatchState, action: PayloadAction<string>){
      state.error = action.payload
    },
    makeChessMove(state: MatchState, action: PayloadAction<IMakeChessMoveDTO>){
      if (state.match && state.matchRecord && state.matchRecordString) {
        if (action.payload.boardState  && action.payload.enPassantPawnCoords !== undefined) {
          updateBoardState(state.match.boardState, action.payload.boardState);
          state.pieceSelected = false;
          state.match.enPassantPawnCoords = action.payload.enPassantPawnCoords;
          state.viewedMove++;
        }

        if (state.activeMatch) {
          state.myTurn = !state.myTurn;
        }
        
        state.matchRecord.push(action.payload.chessMove);
        state.matchRecordString.push(chessMoveToString(action.payload.chessMove));

      } else {
        throw new Error("Match is not found")
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
    resetBoardState(state: MatchState) {
      if (state.match) {
        deleteSelectionFromBoardState(state.match.boardState)
        state.pieceSelected = false;
        state.newMoveStart = null
      } else {
        throw new Error("Match is not found")
      }
    },
    sendChessMoveStart(state: MatchState){
      state.sendingChessMove = true
    },
    sendChessMoveSuccess(state: MatchState){
      state.sendingChessMove = false
      state.newMoveStart = null
    },
    sendChessMoveFailure(state: MatchState, action: PayloadAction<string>){
      state.sendingChessMove = false
      state.error = action.payload
    },
    viewCertainChessMove(state: MatchState, action: PayloadAction<IViewCertainMoveDTO>) {
      if (state.match && state.matchRecord && state.matchRecordString) {
        updateBoardState(state.match.boardState, action.payload.boardState);
        state.pieceSelected = false;
        state.viewedMove = action.payload.moveNumber
        state.match.enPassantPawnCoords = action.payload.enPassantPawnCoords
      }
    },
  }
})


export default matchSlice.reducer
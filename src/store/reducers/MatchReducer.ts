import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChessColor } from '../../models/chess-game/ChessCommon'
import { IChessMove } from '../../models/chess-game/IChessMove'
import { IMatch } from '../../models/chess-game/IMatch'
import { IFindMatchResponse } from '../../models/DTO/match/IFindMatchResponse'
import { IMatchStateResponse } from '../../models/DTO/match/IMatchStateResponse'


type MatchState = {
  searching: boolean
  inMatch: boolean
  matchId: number
  match: IMatch | null
  matchRecord: Array<IChessMove> | null
  error:  string | null
}

const initialState: MatchState = {
  searching: false,
  inMatch: false,
  matchId: -1,
  match: null,
  matchRecord: null,
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
    getMatchStateSuccess(state: MatchState, action: PayloadAction<IMatchStateResponse>){
      state.match = action.payload.match
      state.matchRecord = action.payload.matchRecord
      
      if (state.match.myMatch && !state.match.finished) {
        state.inMatch = true
      } else {
        state.inMatch = false
      }
    },
    getMatchStateFailure(state: MatchState, action: PayloadAction<string>){
      state.error = action.payload
    },
  }
})


export default matchSlice.reducer
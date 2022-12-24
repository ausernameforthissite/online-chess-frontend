import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFindMatchResponse } from '../../models/IFindMatchResponse'


export interface MatchState {
  matchId: number | null
  isLoading: boolean
  error:  string | null
}

const initialState: MatchState = {
  matchId: null,
  isLoading: false,
  error:  null
}

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    findMatchStart(state: MatchState) {
      state.isLoading = true
      state.error = initialState.error
    },
    findMatchSucess(state: MatchState, action: PayloadAction<IFindMatchResponse>){
      state.isLoading = false
      state.matchId = action.payload.matchId
    },
    findMatchFailure(state: MatchState, action: PayloadAction<string>){
      state.isLoading = false
      state.error = action.payload
    }
  }
})


export default matchSlice.reducer
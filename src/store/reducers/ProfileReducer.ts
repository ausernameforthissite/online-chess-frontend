import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProfileResponse } from '../../models/IProfileResponse'

export interface ProfileState {
  profile: string | null
  isLoading: boolean
  error:  string | null
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error:  null
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    loadProfileStart(state: ProfileState) {
      state.isLoading = true
      state.error = initialState.error
    },
    loadProfileSucess(state: ProfileState, action: PayloadAction<IProfileResponse>){
      state.isLoading = false
      state.profile = action.payload.profile
    },
    loadProfileFailure(state: ProfileState, action: PayloadAction<string>){
      state.isLoading = false
      state.error = action.payload
    }
  }
})


export default profileSlice.reducer
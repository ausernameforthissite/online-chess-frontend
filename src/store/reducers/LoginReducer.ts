import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAuthResponse } from '../../models/IAuthResponse'
import { getTokenExpirationTime } from '../../utils/AccessTokenUtils'

export interface LoginState {
  accessToken: string | null
  accessTokenExpirationTime: number | null
  isLoggedIn: boolean
  isLoading: boolean
  error:  string | null
}

const initialState: LoginState = {
  accessToken: null,
  accessTokenExpirationTime: null,
  isLoggedIn: false,
  isLoading: false,
  error:  null
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStart(state: LoginState) {
      state.isLoading = true
      state.error = initialState.error
    },
    loginSucess(state: LoginState, action: PayloadAction<IAuthResponse>){
      state.isLoading = false
      state.isLoggedIn = true
      state.accessToken = action.payload.accessToken
      state.accessTokenExpirationTime = getTokenExpirationTime(action.payload.accessToken)
    },
    loginFailure(state: LoginState, action: PayloadAction<string>){
      state.isLoading = false
      state.error = action.payload
    },
    logoutResult() {

    }
  }
})


export default loginSlice.reducer
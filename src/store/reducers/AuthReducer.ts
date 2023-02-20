import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAuthResponse } from '../../models/DTO/auth/IAuthResponse'
import { getTokenInfo } from '../../utils/AccessTokenUtils'
import { IAccessTokenInfo } from '../../models/IAccessTokenInfo'
import { AxiosPromise } from 'axios'
import { refreshTokenAxios } from '../../api/axiosFunctions/AuthAxiosFunctions'



type AuthState = {
  accessToken: string | null
  accessTokenExpirationTime: number | null
  registered: boolean
  loggedIn: boolean
  loading: boolean
  username: string | null
  error:  string | null
}




const initialState: AuthState = {
  accessToken: null,
  accessTokenExpirationTime: null,
  registered: false,
  loggedIn: false,
  loading: false,
  username: null,
  error:  null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerStart(state: AuthState) {
      state.loading = true
      state.error = null
    },
    registerSuccess(state: AuthState){
      state.loading = false
      state.registered = true
    },
    registerFailure(state: AuthState, action: PayloadAction<string>){
      state.loading = false
      state.error = action.payload
    },
    loginStart(state: AuthState) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state: AuthState, action: PayloadAction<IAuthResponse>){
      state.loading = false
      state.loggedIn = true
      state.registered = true
      const tokenInfo: IAccessTokenInfo  = getTokenInfo(action.payload.accessToken)
      state.accessToken = action.payload.accessToken
      state.accessTokenExpirationTime = tokenInfo.exp
      state.username = tokenInfo.username
    },
    loginFailure(state: AuthState, action: PayloadAction<string>){
      state.loading = false
      state.error = action.payload
    },
    logoutResult() {

    }
  }
})


export default authSlice.reducer


import { loginAxios, logoutAxios, refreshTokenAxios, registerAxios } from "../api/axiosFunctions/AuthAxiosFunctions";
import { IAuthRequest } from "../models/DTO/auth/IAuthRequest";
import { authSlice } from "../store/reducers/AuthReducer";
import { RootState, store } from "../store/store";
import { isTokenExpired } from "../utils/AccessTokenUtils";
import { myHistory } from "../utils/History";



export default class AuthService {


  static async registerUser(registerRequest: IAuthRequest) : Promise<void> {
    try {

      store.dispatch(authSlice.actions.registerStart())
      const res = await registerAxios(registerRequest)
      store.dispatch(authSlice.actions.registerSuccess(res.data))
      myHistory.push('/login') 

    } catch (e: any) {
      console.error(e)
      store.dispatch(authSlice.actions.registerFailure(e.message))
    }
  }


  static async loginUser(loginRequest: IAuthRequest) : Promise<void> {
    try {

      store.dispatch(authSlice.actions.loginStart())
      const res = await loginAxios(loginRequest)
      store.dispatch(authSlice.actions.loginSuccess(res.data))
      console.log(res.data)
      myHistory.push('/') 

    } catch (e: any) {
      console.error(e)
      store.dispatch(authSlice.actions.loginFailure(e.message))
    }
  }


  static async logoutUser() : Promise<void> {
    try {

      await logoutAxios()
      
    } finally {
      store.dispatch(authSlice.actions.logoutResult())
      myHistory.push('/') 
    }
  }


  static async getAccessToken() : Promise<string | null> {
    try {
      const state: RootState = store.getState();
      const accessToken = state.authData.accessToken;
      const tokenExpirationTime = state.authData.accessTokenExpirationTime;

      if (!accessToken || isTokenExpired(tokenExpirationTime)) {

        const res = await refreshTokenAxios()
        store.dispatch(authSlice.actions.loginSuccess(res.data))

        return res.data.accessToken
      }
      
      return accessToken

    } catch (e: any) {
        console.error(e)
        store.dispatch(authSlice.actions.loginFailure(e.message))
        return null
    }
  }

}


import { AxiosPromise, AxiosResponse } from "axios";
import { loginAxios, logoutAxios, refreshTokenAxios, registerAxios } from "../api/axiosFunctions/AuthAxiosFunctions";
import { IAuthRequest } from "../models/DTO/auth/IAuthRequest";
import { IAuthResponse } from "../models/DTO/auth/IAuthResponse";
import { authSlice } from "../store/reducers/AuthReducer";
import { RootState, store } from "../store/store";
import { isTokenExpired } from "../utils/AccessTokenUtils";
import { myHistory } from "../utils/History";


let refreshTokenPromise: AxiosPromise<IAuthResponse> | null = null;


export async function registerUser(registerRequest: IAuthRequest) : Promise<void> {
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


export async function loginUser(loginRequest: IAuthRequest) : Promise<void> {
  try {

    store.dispatch(authSlice.actions.loginStart())
    const res = await loginAxios(loginRequest)
    store.dispatch(authSlice.actions.loginSuccess(res.data))
    myHistory.push('/') 

  } catch (e: any) {
    console.error(e)
    store.dispatch(authSlice.actions.loginFailure(e.message))
  }
}


export async function logoutUser() : Promise<void> {
  try {

    await logoutAxios()
    
  } finally {
    store.dispatch(authSlice.actions.logoutResult())
    myHistory.push('/') 
  }
}


export async function getAccessToken() : Promise<string | null> {
  try {
    const state: RootState = store.getState();
    const accessToken = state.authData.accessToken;
    const tokenExpirationTime = state.authData.accessTokenExpirationTime;

    if (!accessToken || isTokenExpired(tokenExpirationTime)) {
      let res: AxiosResponse<IAuthResponse, any>;
      let promise: AxiosPromise<IAuthResponse>;

      if (state.authData.loading) {
        if (refreshTokenPromise) {
          res = await refreshTokenPromise
          return res.data.accessToken
        }
      } else {

        store.dispatch(authSlice.actions.loginStart());
        refreshTokenPromise = refreshTokenAxios();
        res = await refreshTokenPromise
        store.dispatch(authSlice.actions.loginSuccess(res.data))
        refreshTokenPromise = null
        return res.data.accessToken
      }
    }
    
    return accessToken

  } catch (e: any) {
      console.error(e)
      store.dispatch(authSlice.actions.loginFailure(e.message))
      return null
  }
}
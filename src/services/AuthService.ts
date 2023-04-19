import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { loginAxios, logoutAxios, refreshTokenAxios, registerAxios } from "../api/axiosFunctions/AuthAxiosFunctions";
import { IAuthRequest } from "../models/DTO/auth/IAuthRequest";
import { IAuthResponse } from "../models/DTO/auth/IAuthResponse";
import { ILoginRegisterBadResponse } from "../models/DTO/auth/ILoginRegisterBadResponse";
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
    const errorMessage: string = handleLoginRegisterError(e, false);
    store.dispatch(authSlice.actions.registerFailure(errorMessage));
  }
}


export async function loginUser(loginRequest: IAuthRequest) : Promise<void> {
  try {

    store.dispatch(authSlice.actions.loginStart())
    const res = await loginAxios(loginRequest)
    store.dispatch(authSlice.actions.loginSuccess(res.data))
    myHistory.push('/') 

  } catch (e: any) {
    const errorMessage: string = handleLoginRegisterError(e, true);
    store.dispatch(authSlice.actions.loginFailure(errorMessage));
  }
}

function handleLoginRegisterError(e: any, isLoginError: boolean): string {
  let errorMessage: string = "Не удалось отправить запрос =(";

  if (axios.isAxiosError(e)) {
    const axiosError: AxiosError<ILoginRegisterBadResponse> = e as AxiosError<ILoginRegisterBadResponse>;
    if (axiosError.code && axiosError.code.startsWith("ERR_NETWORK")) {
      errorMessage = "Нет соединения с сервером";
    }

    if (axiosError.response) {
      if (isLoginError && axiosError.response.status === 401) {
        errorMessage = "Неверное имя пользователя или пароль";
      }
      if (axiosError.response.status >= 500) {
        errorMessage = "На сервере что-то сломалось=( Попробуйте ещё раз";
      }
      if (axiosError.response.status === 400 && axiosError.response.data.message) {
        errorMessage = axiosError.response.data.message;
      }
    } 
  }

  console.error(e);
  return errorMessage;
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
    console.error(e);
    store.dispatch(authSlice.actions.loginFailure())
    return null;
  }
}
import { login, logout, refreshToken, register } from "../api/axiosFunctions/AuthAxiosFunctions";
import { ILoginRequest } from "../models/ILoginRequest";
import { IRegisterRequest } from "../models/IRegisterRequest";
import { loginSlice } from "../store/reducers/LoginReducer";
import { registerSlice } from "../store/reducers/RegisterReducer";
import { store } from "../store/store";
import { isTokenExpired } from "../utils/AccessTokenUtils";
import { history } from "../utils/History";



export default class AuthService {


  static async registerUser(registerRequest: IRegisterRequest) : Promise<void> {
    try {

      store.dispatch(registerSlice.actions.registerStart())
      const res = await register(registerRequest)
      store.dispatch(registerSlice.actions.registerSucess(res.data))
      history.push('/login') 

    } catch (e: any) {
      console.error(e)
      store.dispatch(registerSlice.actions.registerFailure(e.message))
    }
  }


  static async loginUser(loginRequest: ILoginRequest) : Promise<void> {
    try {

      store.dispatch(loginSlice.actions.loginStart())
      const res = await login(loginRequest)
      store.dispatch(loginSlice.actions.loginSucess(res.data))
      history.push('/') 

    } catch (e: any) {
      console.error(e)
      store.dispatch(loginSlice.actions.loginFailure(e.message))
    }
  }


  static async logoutUser() : Promise<void> {
    try {

      await logout()
      
    } finally {
      store.dispatch(loginSlice.actions.logoutResult())
      history.push('/') 
    }
  }


  static async getAccessToken() : Promise<string | null> {
    try {
      const accessToken = store.getState().loginData.accessToken

      if (!accessToken || isTokenExpired()) {

        const res = await refreshToken()
        store.dispatch(loginSlice.actions.loginSucess(res.data))

        return res.data.accessToken
      }
      
      return accessToken

    } catch (e: any) {
        console.error(e)
        store.dispatch(loginSlice.actions.loginFailure(e.message))
        return null
    }
  }
}


import axios, { AxiosError } from "axios";
import AuthService from "../services/AuthService";
import { store } from "../store/store";
import Endpoints from "./Endpoints";

export const axiosInstance = axios.create({})

const urlsSkipAuth = [Endpoints.AUTH.REGISTER, Endpoints.AUTH.LOGIN,
                      Endpoints.AUTH.REFRESH, Endpoints.AUTH.LOGOUT]

axiosInstance.interceptors.request.use(async (config) => {
    if (config.url && urlsSkipAuth.includes(config.url)) {
        return config
    }

    const accessToken = await AuthService.getAccessToken()

    if (accessToken) {
        const autharization = `Bearer ${accessToken}`

        config.headers = {
            ...config.headers,
            authorization: autharization
        }
    }

    return config
})


axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {

      if ((error.response?.status === 401) && store.getState().loginData.isLoggedIn && error.request.url !== Endpoints.AUTH.LOGOUT) {
          AuthService.logoutUser()
      }

      throw error
  }
)
import axios, { AxiosError } from "axios";
import { getAccessToken, logoutUser } from "../services/AuthService";
import { store } from "../store/store";
import Endpoints from "./Endpoints";

export const axiosInstance = axios.create({ withCredentials: true })

const urlsSkipAuth = [Endpoints.AUTH.REGISTER, Endpoints.AUTH.LOGIN,
                      Endpoints.AUTH.REFRESH, Endpoints.AUTH.LOGOUT]

axiosInstance.interceptors.request.use(async (config) => {
    if (config.url && urlsSkipAuth.includes(config.url)) {
        return config
    }

    const accessToken = await getAccessToken()

    if (accessToken) {
        const authorization = `Bearer ${accessToken}`

        config.headers = {
            ...config.headers,
            authorization: authorization
        }
    }

    return config
})


axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {

      if ((error.response?.status === 401) && store.getState().authData.loggedIn && error.request.url !== Endpoints.AUTH.LOGOUT) {
          logoutUser()
      }

      throw error
  }
)
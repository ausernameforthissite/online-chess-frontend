import { AxiosPromise } from "axios";
import { IAuthResponse } from "../../models/DTO/auth/IAuthResponse";
import Endpoints from "../Endpoints";
import { axiosInstance } from "../AxiosConfig";
import { IAuthRequest } from "../../models/DTO/auth/IAuthRequest";


export const registerAxios = (params: IAuthRequest): AxiosPromise =>
  axiosInstance.post(Endpoints.AUTH.REGISTER, params)

export const loginAxios = (params: IAuthRequest): AxiosPromise<IAuthResponse> =>
  axiosInstance.post(Endpoints.AUTH.LOGIN, params)

export const refreshTokenAxios = (): AxiosPromise<IAuthResponse> => 
  axiosInstance.post(Endpoints.AUTH.REFRESH)

export const logoutAxios = (): AxiosPromise =>
  axiosInstance.delete(Endpoints.AUTH.LOGOUT)

  export const accessCookie = (): AxiosPromise =>
  axiosInstance.get(Endpoints.AUTH.ACCESS_COOKIE)

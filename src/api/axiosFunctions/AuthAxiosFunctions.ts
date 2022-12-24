import { AxiosPromise } from "axios";
import { IAuthResponse } from "../../models/IAuthResponse";
import { ILoginRequest } from "../../models/ILoginRequest";
import Endpoints from "../Endpoints";
import { axiosInstance } from "../AxiosConfig";
import { IRegisterRequest } from "../../models/IRegisterRequest";

export const register = (params: IRegisterRequest): AxiosPromise =>
  axiosInstance.post(Endpoints.AUTH.REGISTER, params)

export const login = (params: ILoginRequest): AxiosPromise<IAuthResponse> =>
  axiosInstance.post(Endpoints.AUTH.LOGIN, params)

export const refreshToken = (): AxiosPromise<IAuthResponse> => 
  axiosInstance.get(Endpoints.AUTH.REFRESH)

export const logout = (): AxiosPromise =>
  axiosInstance.delete(Endpoints.AUTH.LOGOUT)

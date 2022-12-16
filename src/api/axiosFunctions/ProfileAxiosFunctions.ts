import { AxiosPromise } from "axios";
import { IProfileResponse } from "../../models/IProfileResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";

export const loadProfile = (): AxiosPromise<IProfileResponse> =>
  axiosInstance.get(Endpoints.RESOURCES.PROFILE)
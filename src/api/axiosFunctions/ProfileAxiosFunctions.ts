import { AxiosPromise } from "axios";
import { IFindMatchResponse } from "../../models/IFindMatchResponse";
import { IProfileResponse } from "../../models/IProfileResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";

export const loadProfile = (): AxiosPromise<IProfileResponse> =>
  axiosInstance.get(Endpoints.RESOURCES.PROFILE)

  export const findMatch = (): AxiosPromise<IFindMatchResponse> =>
  axiosInstance.post(Endpoints.RESOURCES.FIND_MATCH)
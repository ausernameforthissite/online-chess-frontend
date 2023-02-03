import { AxiosPromise } from "axios";
import { IFindMatchResponse } from "../../models/DTO/match/IFindMatchResponse";
import { IMatchStateResponse } from "../../models/DTO/match/IMatchStateResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";

export const findMatchAxios = (): AxiosPromise<IFindMatchResponse> =>
  axiosInstance.post(Endpoints.RESOURCES.FIND_MATCH)

  export const getMatchStateAxios = (matchId: number): AxiosPromise<IMatchStateResponse> =>
  axiosInstance.get(Endpoints.RESOURCES.MATCH_STATE_BASE + matchId + "/state")

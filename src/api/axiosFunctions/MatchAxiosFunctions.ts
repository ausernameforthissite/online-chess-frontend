import { AxiosPromise } from "axios";
import { IMatchStateResponse } from "../../models/DTO/match/IMatchStateResponse";
import { IUsersRatingsDataForMatchResponse } from "../../models/DTO/match/IUsersRatingsDataForMatchResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";

export const getMatchStateAxios = (matchId: number): AxiosPromise<IMatchStateResponse> =>
axiosInstance.get(Endpoints.RESOURCES.MATCH_BASE + matchId + "/state")

export const getUsersRatingsDataAxios = (matchId: number): AxiosPromise<IUsersRatingsDataForMatchResponse> =>
axiosInstance.get(Endpoints.RESOURCES.FIND_MATCH_BASE + matchId + "/ratings")


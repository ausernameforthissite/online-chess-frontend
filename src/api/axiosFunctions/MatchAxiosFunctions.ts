import { AxiosPromise } from "axios";
import { IMatchStateResponse } from "../../models/DTO/match/IMatchStateResponse";
import { IUserInMatchStatusResponse } from "../../models/DTO/match/IUserInMatchStatusResponse";
import { IUsersRatingsDataForMatchResponse } from "../../models/DTO/match/IUsersRatingsDataForMatchResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";


export const getUserInMatchStatusAxios = (): AxiosPromise<IUserInMatchStatusResponse> =>
axiosInstance.get(Endpoints.RESOURCES.USER_IN_MATCH_STATUS)

export const getMatchStateAxios = (matchId: number): AxiosPromise<IMatchStateResponse> =>
axiosInstance.get(Endpoints.RESOURCES.MATCH_BASE + matchId + "/state")

export const getUsersRatingsDataAxios = (matchId: number): AxiosPromise<IUsersRatingsDataForMatchResponse> =>
axiosInstance.get(Endpoints.RESOURCES.FIND_MATCH_BASE + matchId + "/ratings")
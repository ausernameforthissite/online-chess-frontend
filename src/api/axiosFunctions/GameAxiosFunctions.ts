import { AxiosPromise } from "axios";
import { IGameStateResponse } from "../../models/DTO/game/IGameStateResponse";
import { IUserInGameStatusResponse } from "../../models/DTO/game/IUserInGameStatusResponse";
import { IUsersRatingsDataForGameResponse } from "../../models/DTO/game/IUsersRatingsDataForGameResponse";
import { axiosInstance } from "../AxiosConfig";
import Endpoints from "../Endpoints";


export const getUserInGameStatusAxios = (): AxiosPromise<IUserInGameStatusResponse> =>
axiosInstance.get(Endpoints.RESOURCES.USER_IN_GAME_STATUS)

export const getGameStateAxios = (gameId: string): AxiosPromise<IGameStateResponse> =>
axiosInstance.get(Endpoints.RESOURCES.GAME_BASE + gameId + "/state")

export const getUsersRatingsDataAxios = (gameId: string): AxiosPromise<IUsersRatingsDataForGameResponse> =>
axiosInstance.get(Endpoints.RESOURCES.FIND_GAME_BASE + gameId + "/ratings")
import { IMatch } from "../models/chess-game/IMatch";
import { IMatchStateResponse } from "../models/DTO/match/IMatchStateResponse";
import { getDefaultBoardState } from "./ChessGameUtils";

export function mapToMatch(matchStateResponse: IMatchStateResponse): IMatch {
  return {
    usersInMatch: matchStateResponse.usersInMatch,
    enPassantPawnCoords: null,
    boardState: getDefaultBoardState(),
    result: matchStateResponse.matchResult } as IMatch;
}
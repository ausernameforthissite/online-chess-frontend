import { IGame } from "../models/chess-game/IGame";
import { IGameStateResponse } from "../models/DTO/game/IGameStateResponse";
import { getDefaultBoardState } from "./ChessGameUtils";

export function mapToGame(gameStateResponse: IGameStateResponse): IGame {
  return {
    usersInGame: gameStateResponse.usersInGame,
    enPassantPawnCoords: null,
    boardState: getDefaultBoardState(),
    result: gameStateResponse.gameResult } as IGame;
}
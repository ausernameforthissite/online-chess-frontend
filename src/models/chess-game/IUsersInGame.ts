import { ChessColor } from "./ChessCommon";

export interface IUsersInGame {
  whiteUsername: string
  blackUsername: string
}


export function isUserInGame(usersInGame: IUsersInGame, username: string): boolean {
  if (usersInGame.whiteUsername === username || usersInGame.blackUsername === username) {
    return true;
  } else {
    return false;
  }
}



export function getColorByUsername(usersInGame: IUsersInGame, username: string): ChessColor {
  if (usersInGame.whiteUsername === username) {
    return ChessColor.white;
  } else if (usersInGame.blackUsername === username) {
    return ChessColor.black;
  } else {
    throw new Error("User with username = " + username + " is not in the game");
  }
}
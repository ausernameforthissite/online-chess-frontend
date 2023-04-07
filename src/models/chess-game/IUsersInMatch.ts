import { ChessColor } from "./ChessCommon";

export interface IUsersInMatch {
  whiteUsername: string
  blackUsername: string
}


export function isUserInMatch(usersInMatch: IUsersInMatch, username: string): boolean {
  if (usersInMatch.whiteUsername === username || usersInMatch.blackUsername === username) {
    return true;
  } else {
    return false;
  }
}



export function getColorByUsername(usersInMatch: IUsersInMatch, username: string): ChessColor {
  if (usersInMatch.whiteUsername === username) {
    return ChessColor.white;
  } else if (usersInMatch.blackUsername === username) {
    return ChessColor.black;
  } else {
    throw new Error("User with username = " + username + " is not in the match");
  }
}
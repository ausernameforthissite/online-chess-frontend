import { ChessColor } from "./ChessCommon";

export interface IUsersInMatch {
  usernames: Array<string>
  currentTurnUserColor: ChessColor;
}


export function isUserInMatch(usersInMatch: IUsersInMatch, username: string): boolean {
  for (let i: number = 0; i < usersInMatch.usernames.length; i++) {
    if (username === usersInMatch.usernames[i]) {
      return true;
    }
  }

  return false;
}

export function getCurrentTurnUsername(usersInMatch: IUsersInMatch): string {
  if (usersInMatch.currentTurnUserColor === ChessColor.white) {
    return usersInMatch.usernames[0];
  } else {
    return usersInMatch.usernames[1];
  }
}


export function getColorByUsername(usersInMatch: IUsersInMatch, username: string): ChessColor {
  if (username === usersInMatch.usernames[0]) {
    return ChessColor.white;
  } else if (username === usersInMatch.usernames[1]) {
    return ChessColor.black;
  } else{
    throw new Error("Username " + username + "  is not found on usersInMatch object");
  }
}

export function getUsernameByColor(usersInMatch: IUsersInMatch, color: ChessColor): string {
  if (color === ChessColor.white) {
    return usersInMatch.usernames[0]
  } else {
    return usersInMatch.usernames[1]
  }
}
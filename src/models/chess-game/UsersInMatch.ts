import { ChessColor } from "./ChessCommon";

export class UsersInMatch {
  public usernames: Array<String>
  public currentTurnUserColor: ChessColor;

  public constructor() {

  }

  public setUsernames(whiteUsername: String, blackUsername: String){
    this.usernames = []
    this.usernames[0] = whiteUsername;
    this.usernames[1] = blackUsername;
  }

  public static copyUsersInMatch(usersInMatchInput: UsersInMatch): UsersInMatch {
    const usersInMatch = new UsersInMatch();
    usersInMatch.setUsernames(<string>usersInMatchInput.usernames.at(0), <string>usersInMatchInput.usernames.at(1));
    usersInMatch.setCurrentTurnUserColor(usersInMatchInput.currentTurnUserColor);
    return usersInMatch;
  }

  public getUsernameByColor(chessColor: ChessColor): String | null {
    if (chessColor === ChessColor.white) {
      return this.usernames[0];
    } else if (chessColor == ChessColor.black) {
        return this.usernames[1];
    } else {
        return null;
    }
  }

  public getColorByUsername(username: String): ChessColor | null {
    if (username === this.usernames[0]) {
      return ChessColor.white;
    } else if (username === this.usernames[1]) {
      return ChessColor.black;
    } else {
      return null;
    }
  }

  public setWhiteUsername(whiteUsername: String) {
    this.usernames[0] = whiteUsername;
  }

  public setBlackUsername(blackUsername: String) {
    this.usernames[1] = blackUsername;
  }


  public getCurrentTurnUserColor(): ChessColor {
    return this.currentTurnUserColor;
  }


  public setCurrentTurnUserColor(currentTurnUserColor: ChessColor) {
    this.currentTurnUserColor = currentTurnUserColor;
  }

  public getCurrentTurnUsername(): String | null {
    if (this.currentTurnUserColor === ChessColor.white) {
        return this.usernames[0];
    } else if (this.currentTurnUserColor === ChessColor.black) {
        return this.usernames[1];
    } else {
        return null;
    }
  }


  public setCurrentTurnUsername(username: String)  {
    if (username === this.usernames[0]) {
      this.currentTurnUserColor = ChessColor.white;
    } else if (username === this.usernames[1]) {
      this.currentTurnUserColor = ChessColor.black;
    } else {
      throw new Error('There is no username ' + username + ' in the UsersInMatch object');
    }
  }

  public isCurrentTurnByUsername(username: String): Boolean {
    return username === this.getCurrentTurnUsername();
  }

  public isCurrentTurnByColor(userColor: ChessColor): Boolean {
    return userColor === this.currentTurnUserColor;
  }

  public isUserInMatch(username: string): boolean {
    return username === this.usernames[0] || username === this.usernames[1]
  }

}
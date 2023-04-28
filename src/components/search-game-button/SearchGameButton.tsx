import React, { FC } from "react";
import { ChessGameTypesType } from "../../models/chess-game/ChessGameType";
import styles from './SearchGameButton.module.css';



type Props = {
  children: JSX.Element
  makeAction: (chessGameType?: ChessGameTypesType) => void
  disabled?: boolean
  chessGameType?: ChessGameTypesType
}


const SearchGameButton: FC<Props> = ({children, makeAction, chessGameType, disabled} : Props) => {


  const handleClickEvent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    makeAction(chessGameType);
  }

  return (
    <button className={styles.searchGameButton} onClick={handleClickEvent} disabled={disabled}>
      {children}
    </button>

  );
}

export default SearchGameButton;
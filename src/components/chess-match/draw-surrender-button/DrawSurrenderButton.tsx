import React, { FC } from "react";
import styles from './DrawSurrenderButton.module.css';

type Props = {
  children: string
  makeAction: () => void
}


const DrawSurrenderButton: FC<Props> = ({children, makeAction} : Props) => {


  const handleClickEvent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    makeAction();
  }


  return (
    <button className={styles.drawSurrenderButton} onClick={handleClickEvent}>
      {children}
    </button>

  )
}

export default DrawSurrenderButton;
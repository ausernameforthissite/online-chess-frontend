import React, { FC } from "react";
import { handleDrawOffer } from "../../../services/MatchService";

import styles from './IncomingDrawButton.module.css';

type Props = {
  children: string
  accept: boolean
}


const IncomingDrawButton: FC<Props> = ({children, accept} : Props) => {


  const handleClickEvent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleDrawOffer(accept);
  }



  return (
    <button className={styles.incomingDrawButton} onClick={handleClickEvent}>
      {children}
    </button>

  )
}

export default IncomingDrawButton;
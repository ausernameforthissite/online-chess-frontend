import React, { FC } from 'react';
import styles from './MyButton.module.css';


type Props = {
  children: string
  makeAction: (accept?: boolean) => void
  disabled?: boolean
  accept?: boolean
}


const MyButton: FC<Props> = ({children, makeAction, disabled, accept} : Props) => {


  const handleClickEvent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    makeAction(accept);
  }

  return (
    <button className={styles.myButton} onClick={handleClickEvent} disabled={disabled}>
      {children}
    </button>

  )
}


export default MyButton;
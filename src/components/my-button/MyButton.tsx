import { FC } from 'react';
import styles from './MyButton.module.css';


type Props = {
  children: string
  makeAction:  (e: React.MouseEvent<HTMLElement>, accept?: boolean) => void
  disabled?: boolean
  accept?: boolean
}


const MyButton: FC<Props> = ({children, makeAction, disabled, accept} : Props) => {


  const handleClickEvent = (e: React.MouseEvent<HTMLElement>) => {
    makeAction(e, accept);
  }

  return (
    <button className={styles.myButton} onClick={handleClickEvent} disabled={disabled}>
      {children}
    </button>

  )
}


export default MyButton;
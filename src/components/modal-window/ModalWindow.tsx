import React, { FC } from "react"
import styles from './ModalWindow.module.css';


type Props = {
  children?: React.ReactNode
  visible: boolean
};

const ModalWindow: FC<Props> = ({children, visible}) => {

  const rootStyles = [styles.modalWindow]

  if (visible) {
    rootStyles.push(styles.active);
  }

  return (
    <div className={rootStyles.join(' ')}>
      <div className={styles.modalWindowContent}>
        {children}
      </div>
    </div>
  )
}

export default ModalWindow
import { FC } from "react";
import styles from './ModalWindow.module.css';

type Props = {
  children: any,
};

const ModalWindow: FC<Props> = ({children}: Props) => {

  return (
      <div className={styles.myModal}>
          <div className={styles.myModalContent}>
            {children}
          </div>
      </div>
  );
};


export default ModalWindow;
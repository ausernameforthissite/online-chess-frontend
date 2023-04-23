import { FC } from 'react';
import styles from './LoadingMessage.module.css';

const LoadingMessage: FC = () => {

  const DEFAULT_MESSAGE = "Загружаем страницу...";

  return (
      <div className={styles.loadingMessageContainer}>
        <div className={styles.loadingMessage}>{DEFAULT_MESSAGE}</div>
      </div>
  )
}

export default LoadingMessage;
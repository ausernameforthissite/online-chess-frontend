import { FC } from 'react';
import MyButton from '../../components/my-button/MyButton';
import { myHistory } from '../../utils/History';
import styles from './Error.module.css';

const Error: FC = () => {

  const DEFAULT_MESSAGE = "Страница не найдена.";

  const goToSearchGame = () => {
    myHistory.push(`/`)
  }


  return (
      <div className={styles.error}>
        <div className={styles.errorMessage}>{DEFAULT_MESSAGE}</div>
        <MyButton makeAction={goToSearchGame}>Перейти на главную</MyButton>
      </div>
  )
}

export default Error;
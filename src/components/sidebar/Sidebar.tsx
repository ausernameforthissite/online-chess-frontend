import { FC } from "react";
import { myHistory } from "../../utils/History";
import styles from './Sidebar.module.css';


const Sidebar: FC = () => {

  const searchGame = (e: React.MouseEvent) => {
    e.preventDefault();

    myHistory.push('/');
  };

  const rating = (e: React.MouseEvent) => {
    e.preventDefault();

    myHistory.push('/rating');
  };


  return (
      <div className={styles.menu}>
        <div className={styles.menuOptionsContainer}>
          <div className={styles.menuOption} onClick={searchGame}>Поиск игры</div>
          <div className={styles.menuOption} onClick={rating}>Рейтинг</div>
        </div>

      </div>
  );
};


export default Sidebar;
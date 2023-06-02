import { FC } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/ReduxHooks";
import { CurrentPageEnum } from "../../models/ApplicationCommon";
import styles from './Sidebar.module.css';



const Sidebar: FC = () => {

  const currentPage: CurrentPageEnum | null = useAppSelector(state => state.authData.currentPage);


  const defaultStyle: React.CSSProperties = {
  };

  const currentPageStyle: React.CSSProperties = {
    backgroundColor: "rgb(88, 120, 135)",
  };


  return (
      <div className={styles.menu}>
        <div className={styles.menuOptionsContainer}>
          <NavLink className={styles.navLink} to="/">
            <div className={styles.menuOption} style={currentPage === CurrentPageEnum.SEARCH_GAME ? currentPageStyle : defaultStyle}>Поиск игры</div>           
          </NavLink>
          <NavLink className={styles.navLink} to="/rating">
            <div className={styles.menuOption} style={currentPage === CurrentPageEnum.RATING ? currentPageStyle : defaultStyle}>Рейтинг</div>
          </NavLink>

        </div>

      </div>
  );
};

export default Sidebar;
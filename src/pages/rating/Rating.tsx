import React, { FC, useEffect } from "react"
import Sidebar from "../../components/sidebar/Sidebar";
import { useAppDispatch } from "../../hooks/ReduxHooks";
import { CurrentPageEnum } from "../../models/ApplicationCommon";
import { authSlice } from "../../store/reducers/AuthReducer";
import stylesCommon from '../PageWithSidebar.module.css';



const Rating: FC = () => {

  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(authSlice.actions.setCurrentPage(CurrentPageEnum.RATING));

    return function cleanup() {
      dispatch(authSlice.actions.setCurrentPage(null));
    }; 
  }, []);


  return (
    <div className={stylesCommon.pageWithSidebar}>
      <Sidebar/>
      
      <div className={stylesCommon.pageWithSidebarContent}>
        <p>Страница в разработке.</p>
      </div>
     
    </div>
  )
}

export default Rating;
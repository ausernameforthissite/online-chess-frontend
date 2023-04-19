import React, { FC } from "react"
import Sidebar from "../../components/sidebar/Sidebar";
import stylesCommon from '../PageWithSidebar.module.css';



const Rating: FC = () => {

  return (
    <div className={stylesCommon.pageWithSidebar}>
      <Sidebar/>
      
      <div className={stylesCommon.pageWithSidebarContent}>
        <h1>Rating</h1>
      </div>
     
    </div>
  )
}

export default Rating;
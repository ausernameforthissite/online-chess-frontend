import React, { FC } from "react"
import Sidebar from "../../components/sidebar/Sidebar";
import stylesCommon from '../PageWithSidebar.module.css';



const Profile: FC = () => {

  return (
    <div className={stylesCommon.pageWithSidebar}>
      <Sidebar/>
      
      <div className={stylesCommon.pageWithSidebarContent}>
        <p>Страница в разработке.</p>
      </div>
     
    </div>
  )
}

export default Profile;
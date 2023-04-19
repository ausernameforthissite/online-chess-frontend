import React, { FC } from "react"
import Sidebar from "../../components/sidebar/Sidebar";
import stylesCommon from '../PageWithSidebar.module.css';



const Profile: FC = () => {

  return (
    <div className={stylesCommon.pageWithSidebar}>
      <Sidebar/>
      
      <div className={stylesCommon.pageWithSidebarContent}>
        <h1>Profile</h1>
      </div>
     
    </div>
  )
}

export default Profile;
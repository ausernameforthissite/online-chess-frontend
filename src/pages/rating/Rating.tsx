import React, { FC } from "react"
import Sidebar from "../../components/sidebar/Sidebar";
import styles from './Rating.module.css';



const Rating: FC = () => {

  return (
    <div className={styles.ratingPage}>
      <Sidebar/>
      
      <div className={styles.ratingPageContent}>
        <h1>Rating</h1>
      </div>
     
    </div>
  )
}

export default Rating;
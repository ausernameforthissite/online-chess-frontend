import { FC, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import styles from './MainGameTimer.module.css';


interface Props {
  timeLeftMS: number;
  stopped: boolean;
}

const MainGameTimer: FC<Props> = ({ timeLeftMS, stopped }) => {

  const defaultStyle: React.CSSProperties = {};
  const [stopGoStyle, setStopGoStyle] = useState(defaultStyle);
  const [previousTimeLeftMS, setPreviousTimeLeftMS] = useState(-1);


  const getExpiryTimestamp = (timeLeftMS: number): Date => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + timeLeftMS);
    return time;
  }

  const initialExpiryTime: Date = getExpiryTimestamp(timeLeftMS);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: initialExpiryTime, onExpire: () => updateMyStyle('rgb(240, 45, 90)') });


  const updateMyStyle = (timerBackgroundColor: string) => {
    const myStyle: React.CSSProperties = {
      backgroundColor: timerBackgroundColor,
    };
    setStopGoStyle(myStyle);
  }


  useEffect(() => {
    if (stopped) {
      if (isRunning) {
        pause();
      }
    } else {
      resume();
    }

    if (previousTimeLeftMS < 0) {
      console.log("Set timelefts + " + timeLeftMS)
      setPreviousTimeLeftMS(timeLeftMS);
    } else if (timeLeftMS !== previousTimeLeftMS) {
      console.log("Set timelefts")
      setPreviousTimeLeftMS(timeLeftMS);
      restart(getExpiryTimestamp(timeLeftMS), !stopped);
    }

    let timerBackgroundColor: string;
    if (timeLeftMS <= 0) {
      timerBackgroundColor = 'rgb(240, 45, 90)';
    } else if (stopped) {
      timerBackgroundColor = 'rgb(151, 164, 170)';
    } else {
      timerBackgroundColor = 'rgb(30, 200, 100)';
    }

    updateMyStyle(timerBackgroundColor);
    console.log("Main timer use effect")

  }, [timeLeftMS, stopped]);



  return (
    <div className={styles.mainTimer} style={stopGoStyle}>
      <div>
        {`${format(minutes)}:${format(seconds)}`}
      </div>
    </div>
  );
}

function format(value: number): string {
  return (value < 10 ? "0" : "") + value.toString();
}


export default MainGameTimer;
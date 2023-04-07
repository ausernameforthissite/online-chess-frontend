import { FC, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

interface Props {
  timeLeftMS: number;
  addWordSecondsWithEnding: boolean;
}

const SecondsCountdownTimer: FC<Props> = ({ timeLeftMS, addWordSecondsWithEnding } : Props) => {

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
  } = useTimer({ expiryTimestamp: initialExpiryTime});


  
  useEffect(() => {
    if (previousTimeLeftMS < 0) {
      setPreviousTimeLeftMS(timeLeftMS);
    } else if (timeLeftMS !== previousTimeLeftMS) {
      setPreviousTimeLeftMS(timeLeftMS);
      restart(getExpiryTimestamp(timeLeftMS), true);
    }
  }, [timeLeftMS]);



  return (
    <span>
        {format(seconds, addWordSecondsWithEnding)}
    </span>
  );
}

function format(value: number, addWordSecondsWithEnding: boolean): string {
  let result: string = (value < 10 ? "0" : "") + value.toString();

  if (addWordSecondsWithEnding) {
    result += " секунд";
    if (value < 5 || value > 20) {
      let reminder: number = value % 10;
      if (reminder === 1) {
        result += "у";
      } else if (reminder >= 2 && reminder <= 4) {
        result += "ы";
      }
    }
  }

  return result;
}


export default SecondsCountdownTimer;
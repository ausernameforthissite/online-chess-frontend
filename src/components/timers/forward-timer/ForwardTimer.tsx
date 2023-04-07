import { FC, Fragment, useEffect, useState } from "react";

interface State {
  time: number,
  seconds: number;
  minutes: number;
}

interface Props {
  time: number;
}

const ForwardTimer: FC<Props> = ({ time }) => {
  const [state, setState] = useState<State>({
    time,
    seconds: time - Math.floor(time / 60) * 60,
    minutes: Math.floor(time / 60),
  });

  useEffect(() => {
    setTimeout(() => {
      setState({
        time: state.time + 1,
        seconds: (state.time +1) - Math.floor((state.time +1) / 60) * 60,
        minutes: Math.floor((state.time +1) / 60),
      });
    }, 1000);
  }, [state.time]);

  return (
    <Fragment>
    <h2>{`${state.minutes}:${format(state.seconds)}`}</h2>
    </Fragment>

  );
}

function format(value: number): string {
  return (value < 10 ? "0" : "") + value.toString();
}


export default ForwardTimer;
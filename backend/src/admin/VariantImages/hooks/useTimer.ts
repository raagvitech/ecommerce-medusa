import { useEffect, useState } from 'react';

type TimerProps = {
  every?: number;
  length?: number;
  onComplete?: () => void;
  recursive?: boolean;
};

export const useTimer = ({ every = 1e3, length = 3e5, onComplete = () => null, recursive = false }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(length);
  const [isRunning, setRunning] = useState(true);

  let countdown: NodeJS.Timeout;
  let timeout: NodeJS.Timeout;

  const handleStop = (restartTimer = false) => {
    setRunning(false);
    clearInterval(countdown);

    if (restartTimer) setTimeLeft(length);

    onComplete();
  };

  useEffect(() => {
    if (!isRunning)
      if (recursive) timeout = setTimeout(() => setRunning(true), 3000);
      else return;

    countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          handleStop();
          return timeLeft;
        }

        return prevTime - every;
      });
    }, every);

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [isRunning]);

  const secondsLeft = Math.ceil(timeLeft / 1000);

  return { timeLeft: secondsLeft, fetching: !isRunning, restart: handleStop.bind(null, true) };
};

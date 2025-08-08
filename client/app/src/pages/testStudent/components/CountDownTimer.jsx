import { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ timeBegin, initialMinutes, autoSubmit }) => {
  const setFirstStateTimeLeft = () => {
    const timeMs = new Date() - new Date(timeBegin); // ms time
    const timeSecond = Math.floor(initialMinutes * 60 - timeMs / 1000); // giây
    return timeSecond > 0 ? timeSecond : 0;
  };
  const [timeLeft, setTimeLeft] = useState(setFirstStateTimeLeft); // number s
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          autoSubmit();
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []); // chỉ chạy 1 lần khi mount

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-xl font-bold">
      ⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default CountdownTimer;

import moment from "moment";
import { useEffect, useState } from "react";

export function useCountdown(targetTimeSec:any) {
  const [remain, setRemain] = useState(targetTimeSec - moment().unix());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemain(targetTimeSec - moment().unix());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimeSec]);

  return remain > 0 ? remain : 0;
}

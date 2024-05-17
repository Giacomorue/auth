"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownProps {
  duration: number; // durata del countdown in secondi
  onComplete: () => void; // callback da chiamare al termine del countdown
}

export const useCountdown = ({ duration, onComplete }: UseCountdownProps) => {
  const [seconds, setSeconds] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setSeconds(duration);
    }
  }, [duration, isActive]);

  const stop = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      onComplete();
      stop();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, seconds, onComplete, stop]);

  return { seconds, start, stop, isActive };
};

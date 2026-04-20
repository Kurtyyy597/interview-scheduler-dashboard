import { useEffect, useState } from "react";


export function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, value]);

  return debounceValue;
}
import { useEffect } from "react";

export function useWatcher(data: unknown) {
  useEffect(() => {
    console.log(data)
  }, [data])
}
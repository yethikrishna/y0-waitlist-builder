import { useState, useEffect } from "react";
import { getWaitlistCount } from "@/lib/waitlist";

export function useWaitlistCount(baseCount: number = 0) {
  const [count, setCount] = useState(baseCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      const dbCount = await getWaitlistCount();
      // Add base count for initial launch (simulated early signups)
      setCount(dbCount + baseCount);
      setIsLoading(false);
    };

    fetchCount();
  }, [baseCount]);

  return { count, isLoading };
}

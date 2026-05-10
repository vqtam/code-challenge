import { useEffect, useState } from 'react';

export function useDelayedVisible(visible: boolean, delayMs: number) {
  const [delayedVisible, setDelayedVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDelayedVisible(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setDelayedVisible(true), delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, visible]);

  return delayedVisible;
}

import { useCallback, useEffect, useRef } from "preact/hooks";

export function useGlobalListener<K extends keyof WindowEventMap>(type:K, handler:(e:WindowEventMap[K]) => void, capture = false, passive = false) {
    const cur = useRef(handler);
    cur.current = handler;
    const proxy = useCallback((e:WindowEventMap[K]) => cur.current(e), []);
    useEffect(() => {
      const opts = passive ? { passive, capture } : capture;
      addEventListener(type, proxy, opts);
      return () => removeEventListener(type, proxy, opts);
    }, [type, capture, passive, proxy]);
}
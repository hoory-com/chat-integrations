import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

/**
 * Focus on element
 */
export function useFocus(initialValue: any, refreshProps: any[] = []) {
  const ref = useRef<any>(initialValue);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref, ...refreshProps]);

  return ref;
}

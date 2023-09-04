/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type Fn<A extends any[], R> = (...args: A) => R;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useEffect : useLayoutEffect;

/**
 * Event callback hook
 * @param fn Function to be called
 * @returns Event callback function
 */
export function useEventCallback<A extends any[], R>(fn: Fn<A, R>): Fn<A, R> {
  // Memoize the onValue callback so that it doesn't change on every render
  const callbackRef = useRef(fn);

  // Update the onValueRef.current value when the onValue callback changes
  // so that the latest version of the callback is used
  useIsomorphicLayoutEffect(() => {
    callbackRef.current = fn;
  });

  return useCallback(
    (...args: A) => callbackRef.current && callbackRef.current(...args),
    [],
  );
}

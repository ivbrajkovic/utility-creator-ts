import { ReactNode, createContext, useState } from "react";
import { Middleware, Observable } from "../class/Observable";
import useObservableContextFactory from "hooks/useObservableContextFactory";
import useSubscribeFactory from "hooks/useSubscribeFactory";
import useSubscribeManyFactory from "hooks/useSubscribeManyFactory";
import useSubscribeAllFactory from "hooks/useSubscribeAllFactory";

export type ObservableContext<T extends Record<string, unknown>> =
  Observable<T> | null;

export function ObservableContextFactory<T extends Record<string, unknown>>() {
  const ObservableContext = createContext<ObservableContext<T>>(null);

  type StateContextProviderProps<T> = {
    initial: T;
    children: ReactNode;
    middlewares?: Middleware<T>[];
  };

  function StateContextProvider(props: StateContextProviderProps<T>) {
    const [observable] = useState<Observable<T>>(() => {
      const o = new Observable(props.initial);
      props.middlewares?.forEach((middleware) => o.use(middleware));
      return o;
    });

    return (
      <ObservableContext.Provider value={observable}>
        {props.children}
      </ObservableContext.Provider>
    );
  }

  const useObservableContext = useObservableContextFactory(ObservableContext);
  const useSubscribe = useSubscribeFactory(useObservableContext);
  const useSubscribeMany = useSubscribeManyFactory(useObservableContext);
  const useSubscribeAll = useSubscribeAllFactory(useObservableContext);

  return [
    StateContextProvider,
    useObservableContext,
    useSubscribe,
    useSubscribeMany,
    useSubscribeAll,
  ] as const;
}

// function useObservableContext() {
//   const observable = useContext(ObservableContext);
//   if (observable === null)
//     throw new Error(
//       `useObservableContext must be used within a ObservableContextProvider`,
//     );
//   return observable;
// }

// function useSubscribe<K extends keyof T>(
//   key: K,
//   handler?: (value: T[K]) => void,
// ) {
//   const observable = useObservableContext();

//   const [state, setState] = useState(() => observable.observed[key]);
//   const handlerRef = useRef(handler ?? setState);

//   useEffect(() => {
//     handlerRef.current = handler ?? setState;
//   }, [handler]);

//   useEffect(() => {
//     return observable.subscribe(key, (_, value) => handlerRef.current(value));
//   }, [key, observable]);

//   const setValue = useCallback(
//     (value: T[K]) => (observable.observed[key] = value),
//     [key, observable],
//   );

//   return [state, setValue] as const;
// }

// function useSubscribeMany<K extends keyof T>(
//   keys: K[],
//   handler?: (key: K, value: T[K]) => void,
// ) {
//   const observable = useObservableContext();

//   const [state, setState] = useState(() =>
//     keys.reduce((acc, key) => {
//       acc[key] = observable.observed[key];
//       return acc;
//     }, {} as Partial<T>),
//   );

//   const handlerRef = useRef(handler);
//   useEffect(() => {
//     handlerRef.current = handler;
//   }, [handler]);

//   useEffect(() => {
//     return observable.subscribeMany(keys, (key, value) => {
//       if (handlerRef.current) handlerRef.current(key as K, value as T[K]);
//       else setState((state) => ({ ...state, [key]: value }));
//     });
//   }, [keys, observable]);

//   const setValue = useCallback(
//     (updates: {
//       [key in K]?: T[key];
//     }) =>
//       Object.entries(updates).forEach(([key, value]) => {
//         observable.observed[key as keyof T] = value as T[keyof T];
//       }),
//     [observable],
//   );

//   return [state, setValue] as const;
// }

// function useSubscribeAll(
//   handler?: (key: keyof T, value: T[keyof T]) => void,
// ) {
//   const observable = useObservableContext();

//   const [state, setState] = useState(() => observable.observed);

//   const handlerRef = useRef(handler);
//   useEffect(() => {
//     handlerRef.current = handler;
//   }, [handler]);

//   useEffect(() => {
//     return observable.subscribeAll((key, value) => {
//       if (handlerRef.current) handlerRef.current(key, value);
//       else setState((state) => ({ ...state, [key]: value }));
//     });
//   }, [observable]);

//   const setValue = useCallback(
//     (updates: Partial<T>) =>
//       Object.entries(updates).forEach(([key, value]) => {
//         observable.observed[key as keyof T] = value as T[keyof T];
//       }),
//     [observable],
//   );

//   return [state, setValue] as const;
// }

import { ReactNode, createContext, useState } from "react";
import { Observable } from "../class/Observable";
import useObservableContextFactory from "hooks/useObservableContextFactory";
import useSubscribeFactory from "hooks/useSubscribeFactory";
import useSubscribeManyFactory from "hooks/useSubscribeManyFactory";
import useSubscribeAllFactory from "hooks/useSubscribeAllFactory";

export type ObservableContext<T extends Record<string, unknown>> =
  Observable<T> | null;

type ContextProviderProps<T> = {
  initial: T;
  children: ReactNode;
};

export function observableContextFactory<T extends Record<string, unknown>>() {
  const ObservableContext = createContext<ObservableContext<T>>(null);

  function ContextProvider(props: ContextProviderProps<T>) {
    const [observable] = useState<Observable<T>>(
      () => new Observable(props.initial),
    );

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
    ContextProvider,
    useObservableContext,
    useSubscribe,
    useSubscribeMany,
    useSubscribeAll,
  ] as const;
}

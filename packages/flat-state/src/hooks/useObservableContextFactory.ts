import { ObservableContext } from "index";
import { useContext, Context } from "react";

const useObservableContextFactory = <T extends Record<string, unknown>>(
  observableContext: Context<ObservableContext<T>>,
) => {
  const useObservableContext = () => {
    const observable = useContext(observableContext);
    if (observable === null)
      throw new Error(
        `useObservableContext must be used within a ObservableContextProvider`,
      );
    return observable;
  };

  return useObservableContext;
};

export default useObservableContextFactory;

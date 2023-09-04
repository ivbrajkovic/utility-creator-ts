import { ObservableContext } from "index";
import { Context } from "react";
declare const useObservableContextFactory: <T extends Record<string, unknown>>(observableContext: Context<ObservableContext<T>>) => () => import("../class/Observable").Observable<T>;
export default useObservableContextFactory;

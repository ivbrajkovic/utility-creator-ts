import { Observable } from "class/Observable";
declare const useSubscribeManyFactory: <T extends Record<string, unknown>>(useObservableContext: () => Observable<T>) => <K extends keyof T>(keys: K[], handler?: ((key: K, value: T[K]) => void) | undefined) => readonly [Partial<T>, (updates: { [key in K]?: T[key] | undefined; }) => void];
export default useSubscribeManyFactory;

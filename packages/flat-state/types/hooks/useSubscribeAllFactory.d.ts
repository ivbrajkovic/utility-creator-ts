import { Observable } from "class/Observable";
declare const useSubscribeAllFactory: <T extends Record<string, unknown>>(useObservableContext: () => Observable<T>) => (handler?: ((key: keyof T, value: T[keyof T]) => void) | undefined) => readonly [T, (updates: Partial<T>) => void];
export default useSubscribeAllFactory;

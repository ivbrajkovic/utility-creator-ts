import { Observable } from "class/Observable";
declare const useSubscribeFactory: <T extends Record<string, unknown>>(useObservableContext: () => Observable<T>) => <K extends keyof T>(key: K, handler?: ((value: T[K]) => void) | undefined) => readonly [T[K], (value: T[K]) => T[K]];
export default useSubscribeFactory;

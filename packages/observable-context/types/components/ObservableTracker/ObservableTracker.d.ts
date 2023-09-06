import { Observable } from "class/Observable";
declare function ObservableTracker<T extends Record<string, unknown>>(props: {
    useObservableContext: () => Observable<T>;
}): import("react/jsx-runtime").JSX.Element;
export default ObservableTracker;

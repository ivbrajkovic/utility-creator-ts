import { ReactNode } from "react";
import { Middleware, Observable } from "../class/Observable";
export type ObservableContext<T extends Record<string, unknown>> = Observable<T> | null;
export declare function ObservableContextFactory<T extends Record<string, unknown>>(): readonly [(props: {
    initial: T;
    children: ReactNode;
    middlewares?: Middleware<T>[] | undefined;
}) => import("react/jsx-runtime").JSX.Element, () => Observable<T>, <K extends keyof T>(key: K, handler?: ((value: T[K]) => void) | undefined) => readonly [T[K], (value: T[K]) => T[K]], <K_1 extends keyof T>(keys: K_1[], handler?: ((key: K_1, value: T[K_1]) => void) | undefined) => readonly [Partial<T>, (updates: { [key in K_1]?: T[key] | undefined; }) => void], (handler?: ((key: keyof T, value: T[keyof T]) => void) | undefined) => readonly [T, (updates: Partial<T>) => void]];

export type Handler<T, K extends keyof T = keyof T> = (key: K, value: T[K]) => void;
export type Middleware<T> = {
    beforeChange?: (key: keyof T, newValue: T[keyof T]) => void;
    afterChange?: (key: keyof T, newValue: T[keyof T]) => void;
};
export type ErrorHandler = (error: Error, context?: string) => void;
export type Subscriber = <T>(key: keyof T, handler: Handler<T>) => void;
export type SubscriberData = {
    key: string;
    handler: string;
    details: string;
};
export declare class Observable<T extends Record<string, unknown>> {
    #private;
    onError: ErrorHandler | null;
    onSubscribe: Subscriber | null;
    onUnsubscribe: Subscriber | null;
    constructor(subject: T);
    get observed(): T;
    use(middleware: Middleware<T>): void;
    subscribe<K extends keyof T>(key: K, handler: Handler<T, K>): () => void;
    subscribeMany<K extends keyof T>(keys: Array<K>, handler: Handler<T>): () => void;
    subscribeAll(handler: Handler<T>): () => void;
    unsubscribe<K extends keyof T>(key: K, handler: Handler<T, K>): void;
    unsubscribeAll(): void;
    subscriberCount(key: keyof T): number;
    subscriberAllCount(): number;
    printSubscribers(output?: boolean): SubscriberData[] | "No subscribers";
    printObservedValues(output?: boolean): {
        Property: keyof T;
        Value: T[keyof T];
    }[] | "No observed values";
}

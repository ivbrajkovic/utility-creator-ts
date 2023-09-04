export type Handler<T, K extends keyof T = keyof T> = (
  key: K,
  value: T[K],
) => void;

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

export class Observable<T extends Record<string, unknown>> {
  #subjectProxy: T;
  #keys: Array<keyof T>;
  #handlers: Map<keyof T, Set<Handler<T>>>;
  #allHandlers: Set<Handler<T>> | null = null;
  #middlewares: Set<Middleware<T>> | null = null;

  onError: ErrorHandler | null = null;
  onSubscribe: Subscriber | null = null;
  onUnsubscribe: Subscriber | null = null;

  constructor(subject: T) {
    this.#keys = Object.keys(subject) as Array<keyof T>;
    this.#handlers = new Map();

    this.#subjectProxy = new Proxy(subject, {
      set: (target, property, newValue: T[keyof T], receiver) => {
        // Property must be of type string
        if (typeof property !== "string") return false;

        // Get property from observed object (target)
        const reflectValue = Reflect.get(target, property, receiver);

        // Do not update property if old and new value are equal
        if (newValue === reflectValue) return true;

        this.#runMiddlewaresBeforeChange(property, newValue);

        // Update property
        const success = Reflect.set(target, property, newValue, receiver);
        if (!success) return false;

        this.#runMiddlewaresAfterChange(property, newValue);

        const invokeHandler = (handler: Handler<T>) => {
          try {
            handler(property, newValue);
          } catch (error) {
            this.#handleError(error, `Handler for key: ${String(property)}`);
          }
        };

        // Notify listeners
        const handlers = this.#handlers.get(property);
        handlers?.forEach(invokeHandler);

        // Notify global listeners
        this.#allHandlers?.forEach(invokeHandler);

        return true;
      },
    });
  }

  get observed() {
    return this.#subjectProxy as T;
  }

  use(middleware: Middleware<T>) {
    if (!this.#middlewares) this.#middlewares = new Set();
    this.#middlewares.add(middleware);
  }

  #runMiddlewaresBeforeChange(key: keyof T, value: T[keyof T]) {
    this.#middlewares?.forEach((middleware) => {
      try {
        middleware.beforeChange?.(key, value);
      } catch (error) {
        this.#handleError(
          error,
          `Middleware (beforeChange) for key: ${String(key)}`,
        );
      }
    });
  }

  #runMiddlewaresAfterChange(key: keyof T, value: T[keyof T]) {
    this.#middlewares?.forEach((middleware) => {
      try {
        middleware.afterChange?.(key, value);
      } catch (error) {
        this.#handleError(
          error,
          `Middleware (afterChange) for key: ${String(key)}`,
        );
      }
    });
  }

  #handleError(error: Error | unknown, context?: string) {
    if (!this.onError) return;
    const safeError = error instanceof Error ? error : new Error(String(error));
    this.onError(safeError, context);
  }

  subscribe<K extends keyof T>(key: K, handler: Handler<T, K>) {
    const handlers = this.#handlers.get(key) ?? new Set();
    handlers.add(handler as Handler<T>);
    this.#handlers.set(key, handlers);
    if (this.onSubscribe) this.onSubscribe(key, handler as Handler<T>);
    return () => {
      this.unsubscribe(key, handler);
    };
  }

  subscribeMany<K extends keyof T>(keys: Array<K>, handler: Handler<T>) {
    keys.forEach((key) => this.subscribe(key, handler));
    return () => keys.forEach((key) => this.unsubscribe(key, handler));
  }

  subscribeAll(handler: Handler<T>) {
    if (!this.#allHandlers) this.#allHandlers = new Set();
    this.#allHandlers.add(handler);
    if (this.onSubscribe) this.onSubscribe("All", handler as Handler<T>);
    return () => {
      this.#allHandlers?.delete(handler);
      if (this.onUnsubscribe) this.onUnsubscribe("All", handler as Handler<T>);
    };
  }

  unsubscribe<K extends keyof T>(key: K, handler: Handler<T, K>) {
    this.#handlers.get(key)?.delete(handler as Handler<T>);
    if (!this.#handlers.get(key)?.size) this.#handlers.delete(key);
    if (this.onUnsubscribe) this.onUnsubscribe(key, handler as Handler<T>);
  }

  unsubscribeAll() {
    this.#handlers.clear();
    this.#allHandlers?.clear();
  }

  subscriberCount(key: keyof T) {
    return this.#handlers.get(key)?.size ?? 0;
  }

  subscriberAllCount() {
    return Array.from(this.#handlers.values()).reduce(
      (acc, handlers) => acc + handlers.size,
      0,
    );
  }

  printSubscribers(output = false) {
    const tableData: SubscriberData[] = [];

    this.#handlers.forEach((handlers, key) => {
      let index = 0;
      handlers.forEach((handler) =>
        tableData.push({
          key: String(key),
          handler: handler.name || `Anonymous #${index++}`,
          details: handler.toString().substring(0, 35) + "...",
        }),
      );
    });

    this.#allHandlers?.forEach((handler) => {
      let index = 0;
      tableData.push({
        key: "All",
        handler: handler.name || `Anonymous #${index}`,
        details: handler.toString().substring(0, 35) + "...",
      });
    });

    if (output) console.table(tableData);
    return tableData.length ? tableData : "No subscribers";
  }

  printObservedValues(output = false) {
    const observedValues = Array.from(this.#keys).map((key) => ({
      Property: key,
      Value: this.#subjectProxy[key],
    }));

    if (output) console.table(observedValues);
    return observedValues.length ? observedValues : "No observed values";
  }
}

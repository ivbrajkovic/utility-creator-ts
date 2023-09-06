import { ObservableContextFactory } from "@ivbrajkovic/observable-context";

export type AppContext = {
  name: string;
  count: number;
};

export const [
  AppContextProvider,
  useAppContext,
  useAppContextSubscribe,
  useAppContextSubscribeMany,
] = ObservableContextFactory<AppContext>();

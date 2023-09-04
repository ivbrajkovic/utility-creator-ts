import { ObservableContextFactory } from "@ivbrajkovic/flat-state";

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

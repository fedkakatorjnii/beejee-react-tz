import React, { ReactNode, ReactElement, createContext } from "react";
import { RootStore } from "./stores";

// const RootContext = createContext<RootStore | null>(null);
export const RootContext = createContext<RootStore>({} as RootStore);

export type RootComponent = React.FC<{
  store: RootStore;
  children: ReactNode;
}>;

export const RootProvider: RootComponent = ({
  children,
  store,
}): ReactElement => {
  return <RootContext.Provider value={store}>{children}</RootContext.Provider>;
};

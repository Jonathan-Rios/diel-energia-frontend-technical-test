import React from "react";

import { LoadingContextProvider } from "./LoadingContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <LoadingContextProvider>{children}</LoadingContextProvider>;
}

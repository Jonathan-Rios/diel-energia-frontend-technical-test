import React, { createContext, useState } from "react";

interface LoadingContextDataProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingContextDataProps>(
  {} as LoadingContextDataProps,
);

interface LoadingContextProviderProps {
  children: React.ReactNode;
}

export function LoadingContextProvider({
  children,
}: LoadingContextProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

import { createContext, useContext } from "react";

export const GeneratorContext = createContext(null);

export function useGenerator() {
  const ctx = useContext(GeneratorContext);
  if (!ctx)
    throw new Error("useGenerator must be used within GeneratorProvider");
  return ctx;
}

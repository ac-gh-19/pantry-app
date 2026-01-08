import { useContext, createContext } from "react";

export const PantryContext = createContext(null);

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error("usePantry must be used within AuthProvider");
  return ctx;
}

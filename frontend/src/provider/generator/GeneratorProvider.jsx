import { useState } from "react";
import { GeneratorContext } from "./GeneratorContext";

export function GeneratorProvider({ children }) {
  const [recipes, setRecipes] = useState(null);

  return (
    <GeneratorContext.Provider value={{ recipes, setRecipes }}>
      {children}
    </GeneratorContext.Provider>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { AuthProvider } from "./provider/auth/AuthProvider";
import { PantryProvider } from "./provider/pantry/PantryProvider";
import { GeneratorProvider } from "./provider/generator/GeneratorProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PantryProvider>
        <GeneratorProvider>
          <RouterProvider router={router}></RouterProvider>
        </GeneratorProvider>
      </PantryProvider>
    </AuthProvider>
  </StrictMode>,
);

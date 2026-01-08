import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import RequireAuth from "../provider/auth/RequireAuth";

import AuthPage from "../pages/AuthPage";
import Pantry from "../pages/Pantry";
import Generator from "../pages/Generator";
import Recipes from "../pages/Recipes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        index: true,
        element: <Navigate to="/auth" replace />,
      },
      {
        path: "pantry",
        element: (
          <RequireAuth>
            <Pantry></Pantry>
          </RequireAuth>
        ),
      },
      {
        path: "recipes/generate",
        element: (
          <RequireAuth>
            <Generator></Generator>
          </RequireAuth>
        ),
      },
      {
        path: "recipes",
        element: (
          <RequireAuth>
            <Recipes></Recipes>
          </RequireAuth>
        ),
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthPage></AuthPage>,
  },
]);

export default router;

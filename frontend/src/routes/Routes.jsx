import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import RequireAuth from "../auth/RequireAuth";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
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
        element: (
            <Navigate to="/pantry" replace />
        ),
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
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
]);

export default router;

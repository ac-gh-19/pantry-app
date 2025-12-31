import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";

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
        element: <Navigate to="/pantry" replace />,
      },
      {
        path: "pantry",
        element: <Pantry></Pantry>,
      },
      {
        path: "recipes/generate",
        element: <Generator></Generator>,
      },
      {
        path: "recipes",
        element: <Recipes></Recipes>,
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

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Pantry from "./pages/Pantry";
import Generator from "./pages/Generator";
import Recipes from "./pages/Recipes";

import { Outlet, Link } from "react-router-dom";
import { apiFetch } from "./auth/client";
import { useMemo } from "react";

export default function App() {
    useMemo(() => {
        async function run() {
            const result = await apiFetch("/api/pantry", {
                method: "GET",
                token: "eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc2NzI1OTcxNiwiZXhwIjoxNzY3MjYzMzE2fQ.xLDfr5_vqBNPPsuFdWx7Vc-iMHJ-AZbDevahoPW9weM"
            })

            console.log("Result", result);
        }

        run();
    }, [])

  return (
    <div className="flex h-screen">
      <div className="border">
        <h1 className="border-b font-bold">PantryChef</h1>
        <nav className="flex flex-col">
            <Link to="/pantry">Pantry</Link>
            <Link to="/recipes/generate">Generate Recipes</Link>
            <Link to="/recipes">Recipes</Link>
        </nav>
      </div>

      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

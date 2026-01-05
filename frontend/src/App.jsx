import Pantry from "./pages/Pantry";
import Generator from "./pages/Generator";
import Recipes from "./pages/Recipes";

import { Outlet, Link } from "react-router-dom";

export default function App() {
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

import { Outlet } from "react-router-dom";
import SidebarLink from "./components/App/SidebarLink";
import { ChefHatIcon } from "lucide-react";
import { Package } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./provider/auth/AuthContext";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br bg-slate-100">
      <div className="flex mx-auto h-screen">
        <aside className="flex flex-col bg-white shadow-xl">
          <div className="flex justify-center items-center px-4 py-6 border-b border-slate-300 gap-3">
            {sidebarOpen && (
              <>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <ChefHatIcon stroke="white" className="w-8"></ChefHatIcon>
                </div>
                <h1 className="font-bold text-xl text-gray-900">PantryChef</h1>
              </>
            )}
            <div
              className="hover:bg-slate-200 rounded-md p-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu></Menu>
            </div>
          </div>

          <nav className="flex flex-col px-4 pb-4 pt-2 gap-1">
            <SidebarLink to="/pantry" Icon={Package} sidebarOpen={sidebarOpen}>
              My Pantry
            </SidebarLink>
            <SidebarLink
              to="/recipes/generate"
              Icon={Sparkles}
              sidebarOpen={sidebarOpen}
            >
              Generate Recipes
            </SidebarLink>
            <SidebarLink
              to="/recipes"
              Icon={ChefHatIcon}
              sidebarOpen={sidebarOpen}
            >
              Recipes
            </SidebarLink>
          </nav>

          <div
            className={`flex gap-2 p-4 mt-auto items-center border-t border-slate-300 ${sidebarOpen ? "" : "justify-center"}`}
          >
            <div
              className="flex gap-2 w-full hover:bg-slate-200 rounded-md p-2 py-3"
              onClick={() => logout()}
            >
              <LogOut></LogOut>
              {sidebarOpen && <div>Logout</div>}
            </div>
          </div>
        </aside>

        <main className="w-full overflow-scroll">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}

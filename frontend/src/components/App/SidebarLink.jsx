import { NavLink } from "react-router-dom";

export default function SidebarLink({ children, to, Icon, sidebarOpen}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-slate-100'}`
      }
    >
      <Icon className="w-5 h-5"></Icon>
      {sidebarOpen && <div className="truncate font-medium">{children}</div>}
    </NavLink>
  );
}

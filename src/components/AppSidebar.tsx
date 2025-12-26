import {
  LayoutDashboard,
  Building2,
  UserCog,
  UserPlus,
  Stethoscope,
  BedDouble,
  Activity,
  DoorOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function AppSidebar() {
  const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Departments", url: "/departments", icon: Building2 },
    { title: "Doctors", url: "/doctors", icon: UserCog },
    { title: "Patient Entry", url: "/patient-entry", icon: UserPlus },
    { title: "Checkup", url: "/checkup", icon: Stethoscope },
    { title: "Admission", url: "/admission", icon: BedDouble },
    { title: "Operations", url: "/operations", icon: Activity },
    { title: "Discharge", url: "/discharge", icon: DoorOpen },
    { title: "Rooms", url: "/rooms", icon: BedDouble },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-card border-r shadow-lg p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-primary">
        Management
      </h2>

      <nav className="space-y-2 flex-1">
        {menuItems.map(({ title, url, icon: Icon }) => (
          <NavLink
            key={title}
            to={url}
            end={url === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {title}
          </NavLink>
        ))}
      </nav>

      <div className="h-10"></div>
    </aside>
  );
}

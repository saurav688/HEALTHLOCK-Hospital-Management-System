import {
  LayoutDashboard,
  Building2,
  UserCog,
  UserPlus,
  Stethoscope,
  BedDouble,
  Activity,
  DoorOpen,
  Heart,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function AppSidebar() {
  const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard, color: "text-blue-500" },
    { title: "Departments", url: "/departments", icon: Building2, color: "text-purple-500" },
    { title: "Doctors", url: "/doctors", icon: UserCog, color: "text-green-500" },
    { title: "Patient Entry", url: "/patient-entry", icon: UserPlus, color: "text-orange-500" },
    { title: "Checkup", url: "/checkup", icon: Stethoscope, color: "text-pink-500" },
    { title: "Admission", url: "/admission", icon: BedDouble, color: "text-cyan-500" },
    { title: "Operations", url: "/operations", icon: Activity, color: "text-red-500" },
    { title: "Discharge", url: "/discharge", icon: DoorOpen, color: "text-yellow-500" },
    { title: "Rooms", url: "/rooms", icon: BedDouble, color: "text-indigo-500" },
    { title: "AI Assistant", url: "/voice-assistant", icon: Sparkles, color: "text-violet-500" },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">HealthLock</h1>
            <p className="text-xs text-gray-600">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
        </div>
        
        {menuItems.map(({ title, url, icon: Icon, color }, index) => (
          <NavLink
            key={title}
            to={url}
            end={url === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 animate-slide-in ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                  : "hover:bg-gray-50 text-gray-700 hover:transform hover:scale-[1.01]"
              }`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : color}`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {title}
                </span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className={`h-3 w-3 ${isActive ? 'text-white/60' : 'text-gray-400'}`} />
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
            <p className="text-xs text-gray-600">System Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

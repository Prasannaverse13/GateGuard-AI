import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Camera, 
  Bell, 
  Settings, 
  X,
  Shield,
  Eye
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900/80 backdrop-blur-md border-r border-gray-800/50 shadow-lg transform transition-transform md:translate-x-0 md:static md:inset-auto md:h-full ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-500" />
              <Eye className="h-4 w-4 text-purple-400 absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">GateGuard AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-glow-blue'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-glow-blue'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/live-monitoring"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-glow-blue'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <Camera className="h-5 w-5 mr-3" />
            <span>Live Monitoring</span>
          </NavLink>

          <NavLink
            to="/alerts-reports"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-glow-blue'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <Bell className="h-5 w-5 mr-3" />
            <span>Alerts & Reports</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-glow-blue'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800/50">
          <div className="status-indicator online text-sm text-gray-400">
            System Status: Online
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
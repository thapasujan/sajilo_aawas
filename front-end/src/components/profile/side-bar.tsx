import { Icon } from "@iconify/react/dist/iconify.js";
import { ProfileSideBar, StudenSideBar } from "../../constant";
import { Link, useLocation } from "react-router-dom";
import { user } from "../../state-management/local/auth";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, X } from "react-feather";

export const SideBar = () => {
  const location = useLocation();
  const userinfo = useSelector(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Define superadmin sidebar items
  const SuperAdminSideBar = [
    {
      id: "manage-profile",
      title: "Manage Profile",
      path: "/profile",
      icon: "mdi:account-cog"
    },
    // Add other superadmin specific items if needed
  ];

  // Determine which sidebar items to show based on user role
  const sidebarItems = userinfo && userinfo.role === "superadmin" 
    ? SuperAdminSideBar 
    : userinfo && userinfo.role === "owner" 
      ? ProfileSideBar 
      : StudenSideBar;

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-44 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md bg-brand ${isSidebarOpen?"hidden":"block"} text-white focus:outline-none`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={12} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-64 bg-white shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col gap-6 border-r border-fav border-opacity-[0.3] p-4 lg:p-6
        `}
      >
        {/* Close button for mobile (inside sidebar) */}
        <div className="flex justify-between items-center lg:hidden border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar items */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          {sidebarItems.map((bar) => (
            <Link
              className={`
                flex items-center gap-4 p-3 rounded-lg transition-colors
                ${location.pathname.endsWith(bar.path) 
                  ? "text-fav bg-fav bg-opacity-10" 
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
              key={bar.id}
              to={bar.path}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Icon icon={bar.icon} width={24} height={24} />
              <span className="text-base lg:text-lg">{bar.title}</span>
            </Link>
          ))}
        </div>

        {/* User info at bottom (optional) */}
        {userinfo && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-fav flex items-center justify-center text-white text-sm">
                {userinfo.name ? userinfo.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium truncate">{userinfo.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{userinfo.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Search,
  Users,
  PlusCircle,
  ChevronRight,
  LibraryBig,
  Library,
  BookPlus,
  User,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Search Books", path: "/search", icon: Search },
    { name: "Global Library", path: "/library", icon: Library },
    { name: "My Bookshelf", path: "/bookshelf", icon: LibraryBig },
    { name: "Add Books", path: "/addbook", icon: BookPlus },
    { name: "Search Clubs", path: "/clubs", icon: Search },
    { name: "My Clubs", path: "/my-clubs", icon: Users },
    { name: "Discover Authors", path: "/discover-authors", icon: User },
    { name: "Create Club", path: "/create-club", icon: PlusCircle },
  ];

  return (
    <>
      {/* Floating Hamburger Button */}
      <button
        className="fixed top-6 left-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-red-600 dark:text-red-400 hover:scale-110 transition-all border border-gray-100 dark:border-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-500 ease-out z-40 border-r border-gray-100 dark:border-gray-800`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          <div className="mb-10 px-2">
            <h2 className="text-2xl font-black text-red-700 dark:text-red-400">
              BiblioHub
            </h2>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">
              Navigation
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="font-bold text-sm tracking-wide">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Footer of Sidebar */}
          <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-tighter">
              &copy; {new Date().getFullYear()} BiblioHub Community
            </p>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

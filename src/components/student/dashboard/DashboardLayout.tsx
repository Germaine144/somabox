import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  HomeIcon,
  BookIcon,
  ChartIcon,
  FolderIcon,
  CalendarIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  BellIcon,
  UserIcon,
  WifiIcon,
  SyncIcon,
} from '../../shared/Icons';
import { useAuth } from '../../../context/AuthContext';

const StudentDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Listen for online/offline status
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Courses', href: '/student/courses', icon: BookIcon },
    { name: 'Browse Courses', href: '/student/browse', icon: ChartIcon },
    { name: 'My Library', href: '/student/library', icon: FolderIcon },
    { name: 'Progress', href: '/student/progress', icon: CalendarIcon },
    { name: 'Settings', href: '/student/settings', icon: SettingsIcon },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-gray-900">Soma Box</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Online status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {isOnline ? (
                <>
                  <WifiIcon className="w-4 h-4" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Sync indicator */}
            {!isOnline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                <SyncIcon className="w-4 h-4" />
                <span>Sync pending</span>
              </div>
            )}

            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Student'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'student@email.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;

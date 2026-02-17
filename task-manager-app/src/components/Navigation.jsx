import React from 'react';
import { User, Home, Settings, List, LogOut } from 'lucide-react';
import { usePermission, useRbacContext } from '../rbac';
import Can from '../rbac/Can';

const Navigation = ({ currentUser, currentPage, setCurrentPage, setCurrentUser }) => {
  const { clearPermissions } = useRbacContext();

  // Define navigation items with their required permissions
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, entity: 'dashboard', action: 'read' },
    { id: 'tasks', label: 'Tasks', icon: List, entity: 'tasks', action: 'read' },
    { id: 'settings', label: 'Settings', icon: Settings, entity: 'settings', action: 'read' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Can key={item.id} entity={item.entity} action={item.action}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                </Can>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">{currentUser?.name}</span>
            </div>
            <button
              onClick={() => {
                clearPermissions();
                setCurrentUser(null);
                setCurrentPage('login');
              }}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import React, { useState } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import SettingsPage from './components/SettingsPage';
import { mockTasks } from './data/mockData';
import ProtectedRoute from './rbac/ProtectedRoute';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [tasks, setTasks] = useState(mockTasks);
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false
  });

  if (!currentUser) {
    return (
      <Login 
        setCurrentUser={setCurrentUser} 
        setCurrentPage={setCurrentPage} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentUser={currentUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setCurrentUser={setCurrentUser}
      />
      {currentPage === 'dashboard' && (
        <ProtectedRoute entity="dashboard" action="read">
          <Dashboard
            currentUser={currentUser}
            tasks={tasks}
          />
        </ProtectedRoute>
      )}
      {currentPage === 'tasks' && (
        <ProtectedRoute entity="tasks" action="read">
          <TasksPage
            tasks={tasks}
            setTasks={setTasks}
          />
        </ProtectedRoute>
      )}
      {currentPage === 'settings' && (
        <ProtectedRoute entity="settings" action="read">
          <SettingsPage
            currentUser={currentUser}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
          />
        </ProtectedRoute>
      )}
    </div>
  );
};

export default App;
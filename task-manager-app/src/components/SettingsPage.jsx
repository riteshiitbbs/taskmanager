import React from 'react';
import { usePermission } from '../rbac';

const SettingsPage = ({ currentUser, userSettings, setUserSettings }) => {
    const canWrite = usePermission('settings', 'write');

    const handleSettingChange = (setting, value) => {
      if (!canWrite) return;
      setUserSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={currentUser?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={currentUser?.role || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Theme</label>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <select
                  value={userSettings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  disabled={!canWrite}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications for task updates</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !userSettings.notifications)}
                  disabled={!canWrite}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userSettings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                  } ${!canWrite ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      userSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Updates</label>
                  <p className="text-sm text-gray-500">Receive daily email summaries</p>
                </div>
                <button
                  onClick={() => handleSettingChange('emailUpdates', !userSettings.emailUpdates)}
                  disabled={!canWrite}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userSettings.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  } ${!canWrite ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      userSettings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="text-sm font-medium text-gray-700">Change Password</div>
                <div className="text-sm text-gray-500">Update your account password</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="text-sm font-medium text-gray-700">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add an extra layer of security</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default SettingsPage;
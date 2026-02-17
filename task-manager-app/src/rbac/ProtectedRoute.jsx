import React from 'react';
import { usePermission } from './RbacContext';

/**
 * ProtectedRoute Component
 * Renders content only if user has the required permission
 * Otherwise shows an access denied message
 *
 * @param {string} entity - Entity name (e.g., 'dashboard', 'tasks')
 * @param {string} action - Action name (e.g., 'read', 'write')
 * @param {React.ReactNode} children - Content to render if permission is granted
 * @param {React.ReactNode} fallback - Optional custom access denied content
 *
 * @example
 * <ProtectedRoute entity="dashboard" action="read">
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ entity, action, children, fallback }) => {
  const hasPermission = usePermission(entity, action);

  if (hasPermission) {
    return <>{children}</>;
  }

  // Default fallback if none provided
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this resource.
        </p>
        <p className="text-sm text-gray-500">
          Required permission: <span className="font-mono font-semibold">{entity}:{action}</span>
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;

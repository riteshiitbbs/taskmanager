import React from 'react';
import { usePermission } from './RbacContext';

/**
 * Can Component
 * Declarative wrapper for conditional rendering based on permissions
 *
 * @param {string} entity - Entity name (e.g., 'dashboard', 'tasks')
 * @param {string} action - Action name (e.g., 'read', 'write', 'delete')
 * @param {React.ReactNode} children - Content to render if permission is granted
 * @param {React.ReactNode} fallback - Optional content to render if permission is denied
 *
 * @example
 * <Can entity="tasks" action="write">
 *   <button>Create Task</button>
 * </Can>
 *
 * @example
 * <Can entity="tasks" action="delete" fallback={<p>No permission</p>}>
 *   <button>Delete Task</button>
 * </Can>
 */
const Can = ({ entity, action, children, fallback = null }) => {
  const hasPermission = usePermission(entity, action);

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default Can;

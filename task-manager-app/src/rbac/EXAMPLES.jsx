/**
 * RBAC Usage Examples
 *
 * This file demonstrates various ways to use the RBAC system in your components.
 * These are reference examples - copy and adapt them to your needs.
 */

import React from 'react';
import { usePermission, usePermissions, useIAMUtil, Can, ProtectedRoute } from './index';

// ============================================================================
// Example 1: Using usePermission Hook
// ============================================================================
export const Example1_UsePermissionHook = () => {
  const canWrite = usePermission('tasks', 'write');
  const canDelete = usePermission('tasks', 'delete');

  return (
    <div>
      <h2>Tasks</h2>
      <button disabled={!canWrite}>
        {canWrite ? 'Create Task' : 'No Permission to Create'}
      </button>
      <button disabled={!canDelete} style={{ marginLeft: '10px' }}>
        {canDelete ? 'Delete Task' : 'No Permission to Delete'}
      </button>
    </div>
  );
};

// ============================================================================
// Example 2: Using Can Component (Recommended for simple show/hide)
// ============================================================================
export const Example2_CanComponent = () => {
  return (
    <div>
      <h2>Dashboard Actions</h2>

      {/* Simple conditional rendering */}
      <Can entity="dashboard" action="write">
        <button>Edit Dashboard</button>
      </Can>

      {/* With fallback message */}
      <Can entity="reports" action="export" fallback={<p>You cannot export reports</p>}>
        <button>Export Report</button>
      </Can>

      {/* Nested Can components */}
      <Can entity="tasks" action="read">
        <div>
          <h3>Task List</h3>
          <Can entity="tasks" action="write">
            <button>Add Task</button>
          </Can>
        </div>
      </Can>
    </div>
  );
};

// ============================================================================
// Example 3: Using ProtectedRoute for Pages
// ============================================================================
export const Example3_ProtectedRoute = () => {
  return (
    <>
      {/* Basic route protection */}
      <ProtectedRoute entity="dashboard" action="read">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to the dashboard</p>
        </div>
      </ProtectedRoute>

      {/* With custom access denied message */}
      <ProtectedRoute
        entity="admin"
        action="read"
        fallback={
          <div>
            <h1>Access Denied</h1>
            <p>You need admin privileges to access this page</p>
          </div>
        }
      >
        <div>
          <h1>Admin Panel</h1>
          <p>Admin controls here</p>
        </div>
      </ProtectedRoute>
    </>
  );
};

// ============================================================================
// Example 4: Using usePermissions for Multiple Actions
// ============================================================================
export const Example4_UsePermissionsHook = () => {
  // Check multiple actions for same entity at once
  const { read, write, delete: canDelete } = usePermissions('tasks', [
    'read',
    'write',
    'delete',
  ]);

  return (
    <div>
      <h2>Task Permissions</h2>
      <ul>
        <li>Can Read: {read ? '✅' : '❌'}</li>
        <li>Can Write: {write ? '✅' : '❌'}</li>
        <li>Can Delete: {canDelete ? '✅' : '❌'}</li>
      </ul>

      {write && (
        <form>
          <input placeholder="Task name" />
          <button>Create Task</button>
        </form>
      )}
    </div>
  );
};

// ============================================================================
// Example 5: Using IAMUtil for Imperative Checks
// ============================================================================
export const Example5_IAMUtil = () => {
  const IAMUtil = useIAMUtil();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check permission before performing action
    if (!IAMUtil('tasks', 'write')) {
      alert('You do not have permission to create tasks');
      return;
    }

    // Perform action
    console.log('Creating task...');
  };

  const handleDelete = (taskId) => {
    // Check permission in callback
    if (!IAMUtil('tasks', 'delete')) {
      alert('You do not have permission to delete tasks');
      return;
    }

    // Confirm and delete
    if (window.confirm('Are you sure?')) {
      console.log('Deleting task:', taskId);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="Task name" />
        <button type="submit">Create</button>
      </form>
      <button onClick={() => handleDelete(123)}>Delete Task #123</button>
    </div>
  );
};

// ============================================================================
// Example 6: Table with Row-Level Actions
// ============================================================================
export const Example6_TableWithPermissions = () => {
  const canEdit = usePermission('tasks', 'write');
  const canDelete = usePermission('tasks', 'delete');

  const tasks = [
    { id: 1, name: 'Task 1', status: 'pending' },
    { id: 2, name: 'Task 2', status: 'completed' },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.name}</td>
            <td>{task.status}</td>
            <td>
              {/* Show edit button only if user has write permission */}
              {canEdit && <button>Edit</button>}

              {/* Show delete button only if user has delete permission */}
              {canDelete && <button>Delete</button>}

              {/* Alternative using Can component */}
              <Can entity="tasks" action="write">
                <button>Edit</button>
              </Can>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ============================================================================
// Example 7: Form Fields with Conditional Editing
// ============================================================================
export const Example7_FormWithPermissions = () => {
  const canRead = usePermission('settings', 'read');
  const canWrite = usePermission('settings', 'write');

  const [settings, setSettings] = React.useState({
    theme: 'light',
    notifications: true,
  });

  const handleChange = (field, value) => {
    if (!canWrite) {
      alert('You do not have permission to edit settings');
      return;
    }
    setSettings({ ...settings, [field]: value });
  };

  if (!canRead) {
    return <p>You do not have permission to view settings</p>;
  }

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>Theme:</label>
        <select
          value={settings.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
          disabled={!canWrite}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleChange('notifications', e.target.checked)}
            disabled={!canWrite}
          />
          Enable Notifications
        </label>
      </div>
      {!canWrite && <p style={{ color: 'gray' }}>Read-only mode</p>}
    </div>
  );
};

// ============================================================================
// Example 8: Navigation Menu with Dynamic Items
// ============================================================================
export const Example8_NavigationMenu = () => {
  const menuItems = [
    { label: 'Dashboard', entity: 'dashboard', action: 'read', path: '/dashboard' },
    { label: 'Tasks', entity: 'tasks', action: 'read', path: '/tasks' },
    { label: 'Reports', entity: 'reports', action: 'read', path: '/reports' },
    { label: 'Admin', entity: 'users', action: 'read', path: '/admin' },
  ];

  return (
    <nav>
      <ul>
        {menuItems.map((item) => (
          <Can key={item.path} entity={item.entity} action={item.action}>
            <li>
              <a href={item.path}>{item.label}</a>
            </li>
          </Can>
        ))}
      </ul>
    </nav>
  );
};

// ============================================================================
// Example 9: Conditional Button Variants
// ============================================================================
export const Example9_ConditionalButtonVariants = () => {
  const canWrite = usePermission('tasks', 'write');
  const canDelete = usePermission('tasks', 'delete');

  return (
    <div>
      {/* Show different button based on permissions */}
      {canWrite ? (
        <button className="primary">Save Changes</button>
      ) : (
        <button className="secondary" disabled>
          View Only
        </button>
      )}

      {/* Dangerous action requires specific permission */}
      {canDelete && (
        <button className="danger">Delete All</button>
      )}
    </div>
  );
};

// ============================================================================
// Example 10: Data Filtering Based on Permissions
// ============================================================================
export const Example10_DataFiltering = ({ tasks, userId }) => {
  const canViewAll = usePermission('tasks', 'view_all');

  // Filter data based on permissions
  const visibleTasks = React.useMemo(() => {
    if (canViewAll) {
      return tasks; // Admin can see all tasks
    }
    // Regular users only see their own tasks
    return tasks.filter((task) => task.assigneeId === userId);
  }, [tasks, canViewAll, userId]);

  return (
    <div>
      <h2>My Tasks {canViewAll && '(All Tasks)'}</h2>
      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// Example 11: Passing Entity/Action as Props (Component Composition)
// ============================================================================
export const ActionButton = ({ entity, action, label, onClick }) => {
  const hasPermission = usePermission(entity, action);

  if (!hasPermission) {
    return null; // or return disabled button
  }

  return <button onClick={onClick}>{label}</button>;
};

export const Example11_ComponentComposition = () => {
  return (
    <div>
      {/* Reusable button with dynamic permissions */}
      <ActionButton
        entity="tasks"
        action="write"
        label="Create Task"
        onClick={() => console.log('Creating task')}
      />
      <ActionButton
        entity="tasks"
        action="delete"
        label="Delete Task"
        onClick={() => console.log('Deleting task')}
      />
      <ActionButton
        entity="reports"
        action="export"
        label="Export Report"
        onClick={() => console.log('Exporting report')}
      />
    </div>
  );
};

// ============================================================================
// Example 12: Complex Permission Logic
// ============================================================================
export const Example12_ComplexLogic = () => {
  const canReadTasks = usePermission('tasks', 'read');
  const canWriteTasks = usePermission('tasks', 'write');
  const canDeleteTasks = usePermission('tasks', 'delete');
  const canReadReports = usePermission('reports', 'read');

  // Complex permission logic
  const canManageTasks = canWriteTasks && canDeleteTasks;
  const hasAnyTaskPermission = canReadTasks || canWriteTasks || canDeleteTasks;
  const isAdmin = canManageTasks && canReadReports;

  return (
    <div>
      <h2>User Capabilities</h2>
      {isAdmin && <p>✅ You have admin access</p>}
      {canManageTasks && <p>✅ You can fully manage tasks</p>}
      {hasAnyTaskPermission && <p>✅ You have some task permissions</p>}

      {canManageTasks && (
        <div>
          <button>Bulk Edit</button>
          <button>Bulk Delete</button>
        </div>
      )}
    </div>
  );
};

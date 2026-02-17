# RBAC Implementation Guide

## Overview

This is a simple, performant Role-Based Access Control (RBAC) system built with React Context. It uses static JSON mock data and provides a clean API where each component passes `entity` and `action` to check permissions.

## Architecture

### Core Concepts

- **Entity**: A resource in the system (e.g., `dashboard`, `tasks`, `settings`)
- **Action**: An operation on an entity (e.g., `read`, `write`, `delete`)
- **Permission**: A combination of entity and action (e.g., `dashboard_read`)
- **Role**: A collection of permissions (e.g., `admin`, `manager`, `user`)

### Data Structure

Permissions are stored in a dual-index structure for optimal performance:

```javascript
{
  permissionsSet: Set(['dashboard_read', 'tasks_write', ...]), // O(1) lookup
  permissionsMap: Map({
    'dashboard_read': { id, entity, action, description },
    ...
  }), // O(1) metadata access
  userRoles: [{ id, name, displayName, permissions }]
}
```

## File Structure

```
src/
├── rbac/
│   ├── RbacContext.jsx       # React Context with permission state and hooks
│   ├── Can.jsx               # Conditional rendering wrapper component
│   ├── ProtectedRoute.jsx    # Route protection component
│   ├── permissionUtils.js    # Utility functions and IAMUtil class
│   └── index.js              # Public API exports
├── data/
│   └── rbacData.js           # Mock RBAC data (roles, permissions, users)
└── components/
    └── [Your components with permission checks]
```

## Usage Patterns

### 1. Hook-Based Permission Check

Use when you need a boolean value in your component logic:

```jsx
import { usePermission } from '../rbac';

const MyComponent = () => {
  const canEdit = usePermission('tasks', 'write');
  const canDelete = usePermission('tasks', 'delete');

  return (
    <div>
      <button disabled={!canEdit}>Edit</button>
      {canDelete && <button>Delete</button>}
    </div>
  );
};
```

### 2. Declarative Can Component

Use for conditional rendering based on permissions:

```jsx
import { Can } from '../rbac';

const MyComponent = () => {
  return (
    <div>
      <Can entity="tasks" action="write">
        <button>Create Task</button>
      </Can>

      <Can entity="tasks" action="delete" fallback={<p>No permission</p>}>
        <button>Delete Task</button>
      </Can>
    </div>
  );
};
```

### 3. Protected Routes

Use to guard entire pages/routes:

```jsx
import { ProtectedRoute } from '../rbac';

const App = () => {
  return (
    <ProtectedRoute entity="dashboard" action="read">
      <Dashboard />
    </ProtectedRoute>
  );
};
```

### 4. Imperative IAMUtil Function

Use in event handlers, callbacks, or outside React components:

```jsx
import { useIAMUtil } from '../rbac';

const MyComponent = () => {
  const IAMUtil = useIAMUtil();

  const handleAction = () => {
    if (IAMUtil('tasks', 'write')) {
      // Perform action
      console.log('User can write tasks');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
};
```

## Available Roles & Permissions

### Roles

| Role       | Display Name   | Description                                    |
|------------|----------------|------------------------------------------------|
| `admin`    | Administrator  | Full access to all features                    |
| `manager`  | Manager        | Can manage tasks and view reports              |
| `user`     | User           | Can view and edit own tasks                    |
| `viewer`   | Viewer         | Read-only access to dashboard and tasks        |

### Permissions Matrix

| Permission           | Admin | Manager | User | Viewer |
|---------------------|-------|---------|------|--------|
| dashboard_read      | ✅    | ✅      | ✅   | ✅     |
| dashboard_write     | ✅    | ❌      | ❌   | ❌     |
| tasks_read          | ✅    | ✅      | ✅   | ✅     |
| tasks_write         | ✅    | ✅      | ✅   | ❌     |
| tasks_delete        | ✅    | ✅      | ❌   | ❌     |
| tasks_assign        | ✅    | ✅      | ❌   | ❌     |
| settings_read       | ✅    | ✅      | ✅   | ✅     |
| settings_write      | ✅    | ✅      | ✅   | ❌     |
| users_read          | ✅    | ❌      | ❌   | ❌     |
| users_write         | ✅    | ❌      | ❌   | ❌     |
| users_delete        | ✅    | ❌      | ❌   | ❌     |
| reports_read        | ✅    | ✅      | ✅   | ✅     |
| reports_export      | ✅    | ✅      | ❌   | ❌     |

## Demo Credentials

Test the different permission levels with these accounts:

| Email                   | Password     | Role        |
|------------------------|--------------|-------------|
| admin@example.com      | admin123     | Admin       |
| manager@example.com    | manager123   | Manager     |
| user@example.com       | user123      | User        |
| viewer@example.com     | viewer123    | Viewer      |

## Implementation Details

### Login Flow with RBAC

1. User enters credentials
2. Login component finds user in mock data
3. `fetchUserPermissions(userId)` simulates API call
4. Permissions are initialized in RBAC Context via `initializePermissions()`
5. User is redirected to dashboard

```jsx
const handleLogin = async () => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const userPermissionsData = await fetchUserPermissions(user.id);
    initializePermissions(userPermissionsData); // Initialize RBAC
    setCurrentUser(user);
    setCurrentPage('dashboard');
  }
};
```

### Logout Flow

Clear permissions when user logs out:

```jsx
const handleLogout = () => {
  clearPermissions(); // Clear RBAC context
  setCurrentUser(null);
  setCurrentPage('login');
};
```

### Adding New Permissions

1. Add permission to `permissions` array in `src/data/rbacData.js`:

```javascript
{
  id: 'p14',
  entity: 'reports',
  action: 'delete',
  description: 'Delete reports'
}
```

2. Add permission ID to relevant roles:

```javascript
{
  id: 'r1',
  name: 'admin',
  permissions: ['p1', 'p2', ..., 'p14'] // Add new permission
}
```

3. Use in components:

```jsx
<Can entity="reports" action="delete">
  <button>Delete Report</button>
</Can>
```

## Performance Optimizations

### 1. Memoized Lookups

Permission checks use `Set.has()` for O(1) lookup:

```javascript
const hasPermission = (entity, action) => {
  const key = `${entity}_${action}`;
  return permissionsSet.has(key); // O(1) lookup
};
```

### 2. Context Value Memoization

Context value is memoized to prevent unnecessary re-renders:

```javascript
const contextValue = useMemo(
  () => ({ hasPermission, clearPermissions, ... }),
  [permissionsSet, permissionsMap, userRoles]
);
```

### 3. Hook Memoization

`usePermission` hook memoizes results:

```javascript
export const usePermission = (entity, action) => {
  const { hasPermission } = useRbacContext();
  return useMemo(
    () => hasPermission(entity, action),
    [hasPermission, entity, action]
  );
};
```

## Best Practices

### ✅ Do

- Use `<Can>` for simple show/hide UI elements
- Use `usePermission()` when you need the boolean in component logic
- Use `ProtectedRoute` for entire pages
- Pass `entity` and `action` as props for dynamic permission checks
- Clear permissions on logout
- Use descriptive entity and action names

### ❌ Don't

- Don't bypass permission checks for "convenience"
- Don't store sensitive data in frontend (permissions are for UI only)
- Don't rely on frontend permissions for security (always validate on backend)
- Don't perform permission checks in render loops without memoization
- Don't forget to wrap app with `<RbacProvider>`

## Extending the System

### Adding Wildcard Permissions

To support `dashboard_*` (all dashboard actions):

```javascript
const hasPermission = (entity, action) => {
  const exactKey = `${entity}_${action}`;
  const wildcardKey = `${entity}_*`;
  const superKey = `*_*`;

  return (
    permissionsSet.has(exactKey) ||
    permissionsSet.has(wildcardKey) ||
    permissionsSet.has(superKey)
  );
};
```

### Integrating with Real API

Replace mock data with API calls:

```javascript
import { fetchUserPermissions } from '../api/auth';

const handleLogin = async () => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    initializePermissions({
      permissions: data.permissions, // Array of permission objects
      roles: data.roles              // Array of role objects
    });
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Expected API Response Format

```json
{
  "userId": 1,
  "userName": "Admin User",
  "roles": [
    {
      "id": "r1",
      "name": "admin",
      "displayName": "Administrator"
    }
  ],
  "permissions": [
    {
      "id": "p1",
      "entity": "dashboard",
      "action": "read",
      "description": "View dashboard statistics"
    },
    {
      "id": "p2",
      "entity": "dashboard",
      "action": "write",
      "description": "Modify dashboard layout"
    }
  ]
}
```

## Troubleshooting

### Issue: "useRbacContext must be used within RbacProvider"

**Solution**: Ensure your app is wrapped with `<RbacProvider>` in `src/index.js`:

```jsx
<RbacProvider>
  <App />
</RbacProvider>
```

### Issue: All permission checks return false

**Solution**: Check that permissions are initialized after login:

```javascript
// In Login component
initializePermissions(userPermissionsData);
```

### Issue: Components not re-rendering when permissions change

**Solution**: Use hooks instead of direct context access for reactive updates:

```jsx
// ✅ Good - will re-render
const canEdit = usePermission('tasks', 'write');

// ❌ Bad - won't re-render
const { permissionsSet } = useRbacContext();
```

## Security Considerations

⚠️ **Important**: Frontend permissions are for UX only, NOT security!

- Always validate permissions on the backend
- Never trust client-side permission checks
- Use HTTPS for API communication
- Implement proper JWT/session management
- Validate all user inputs on the server
- Log permission-based actions for auditing

## Summary

This RBAC implementation provides:

- ✅ Simple API: `entity` + `action` = boolean
- ✅ Performance: O(1) permission lookups using Set
- ✅ Flexibility: Hooks, components, and imperative API
- ✅ Type Safety: Clear permission structure
- ✅ Scalability: Handles 50-200 permissions efficiently
- ✅ React Context: No external state management needed
- ✅ Mock Data: Easy testing and development

Start using it by wrapping components with `<Can>` or using `usePermission()` hooks!

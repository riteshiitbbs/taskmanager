/**
 * Mock RBAC Data
 * Static permission and role definitions for the task manager application
 */

// All available permissions in the system
export const permissions = [
  // Dashboard permissions
  { id: 'p1', entity: 'dashboard', action: 'read', description: 'View dashboard statistics and overview' },
  { id: 'p2', entity: 'dashboard', action: 'write', description: 'Modify dashboard layout and widgets' },

  // Tasks permissions
  { id: 'p3', entity: 'tasks', action: 'read', description: 'View tasks list' },
  { id: 'p4', entity: 'tasks', action: 'write', description: 'Create and edit tasks' },
  { id: 'p5', entity: 'tasks', action: 'delete', description: 'Delete tasks' },
  { id: 'p6', entity: 'tasks', action: 'assign', description: 'Assign tasks to users' },

  // Settings permissions
  { id: 'p7', entity: 'settings', action: 'read', description: 'View settings' },
  { id: 'p8', entity: 'settings', action: 'write', description: 'Modify personal settings' },

  // Users permissions (admin only)
  { id: 'p9', entity: 'users', action: 'read', description: 'View user list' },
  { id: 'p10', entity: 'users', action: 'write', description: 'Create and edit users' },
  { id: 'p11', entity: 'users', action: 'delete', description: 'Delete users' },

  // Reports permissions
  { id: 'p12', entity: 'reports', action: 'read', description: 'View reports' },
  { id: 'p13', entity: 'reports', action: 'export', description: 'Export reports' },
];

// Role definitions with associated permissions
export const roles = [
  {
    id: 'r1',
    name: 'admin',
    displayName: 'Administrator',
    permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13']
  },
  {
    id: 'r2',
    name: 'manager',
    displayName: 'Manager',
    permissions: ['p1', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p12', 'p13']
  },
  {
    id: 'r3',
    name: 'user',
    displayName: 'User',
    permissions: ['p1', 'p3', 'p4', 'p7', 'p8', 'p12']
  },
  {
    id: 'r4',
    name: 'viewer',
    displayName: 'Viewer',
    permissions: ['p1', 'p3', 'p7', 'p12']
  }
];

// Mock users with assigned roles
export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    roles: ['r1'] // admin
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    roles: ['r2'] // manager
  },
  {
    id: 3,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    roles: ['r3'] // user
  },
  {
    id: 4,
    name: 'Viewer User',
    email: 'viewer@example.com',
    password: 'viewer123',
    roles: ['r4'] // viewer
  }
];

/**
 * Helper function to get all permissions for a user based on their roles
 * @param {Array<string>} userRoles - Array of role IDs (e.g., ['r1', 'r2'])
 * @returns {Array<Object>} Array of permission objects
 */
export const getUserPermissions = (userRoles) => {
  const permissionIds = new Set();

  // Collect all permission IDs from user's roles
  userRoles.forEach(roleId => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      role.permissions.forEach(permId => permissionIds.add(permId));
    }
  });

  // Map permission IDs to full permission objects
  return permissions.filter(p => permissionIds.has(p.id));
};

/**
 * Simulate API call to fetch user permissions
 * @param {number} userId
 * @returns {Promise<Object>} User with permissions
 */
export const fetchUserPermissions = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }

  const userPermissions = getUserPermissions(user.roles);

  return {
    userId: user.id,
    userName: user.name,
    roles: user.roles.map(roleId => roles.find(r => r.id === roleId)),
    permissions: userPermissions
  };
};

/**
 * Permission Utility Functions
 * Standalone helper functions for permission management
 */

/**
 * Generate permission key from entity and action
 * @param {string} entity - Entity name
 * @param {string} action - Action name
 * @returns {string} Permission key in format "entity_action"
 */
export const generatePermissionKey = (entity, action) => {
  return `${entity}_${action}`;
};

/**
 * Parse permission key into entity and action
 * @param {string} key - Permission key in format "entity_action"
 * @returns {Object} Object with entity and action properties
 */
export const parsePermissionKey = (key) => {
  const [entity, action] = key.split('_');
  return { entity, action };
};

/**
 * Build permissions data structure from API response
 * Transforms array of permission objects into Set and Map for efficient lookup
 * @param {Array<Object>} permissions - Array of permission objects
 * @returns {Object} Object with permissionsSet and permissionsMap
 */
export const buildPermissionsStructure = (permissions) => {
  const permissionsSet = new Set();
  const permissionsMap = new Map();

  permissions.forEach(permission => {
    const key = generatePermissionKey(permission.entity, permission.action);
    permissionsSet.add(key);
    permissionsMap.set(key, permission);
  });

  return { permissionsSet, permissionsMap };
};

/**
 * Filter permissions by entity
 * @param {Array<Object>} permissions - Array of permission objects
 * @param {string} entity - Entity name to filter by
 * @returns {Array<Object>} Filtered permissions
 */
export const filterPermissionsByEntity = (permissions, entity) => {
  return permissions.filter(p => p.entity === entity);
};

/**
 * Group permissions by entity
 * @param {Array<Object>} permissions - Array of permission objects
 * @returns {Object} Object with entity names as keys and arrays of permissions as values
 */
export const groupPermissionsByEntity = (permissions) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.entity]) {
      acc[permission.entity] = [];
    }
    acc[permission.entity].push(permission);
    return acc;
  }, {});
};

/**
 * Get all actions available for an entity
 * @param {Array<Object>} permissions - Array of permission objects
 * @param {string} entity - Entity name
 * @returns {Array<string>} Array of action names
 */
export const getEntityActions = (permissions, entity) => {
  return permissions
    .filter(p => p.entity === entity)
    .map(p => p.action);
};

/**
 * Check if permissions array includes a specific permission
 * @param {Array<Object>} permissions - Array of permission objects
 * @param {string} entity - Entity name
 * @param {string} action - Action name
 * @returns {boolean} True if permission exists in array
 */
export const hasPermissionInArray = (permissions, entity, action) => {
  return permissions.some(p => p.entity === entity && p.action === action);
};

/**
 * Standalone IAMUtil class for imperative permission checks
 * Use this when you need permission checks outside React components
 *
 * @example
 * const iam = new IAMUtil(permissionsSet);
 * if (iam.can('dashboard', 'read')) {
 *   // User can read dashboard
 * }
 */
export class IAMUtil {
  constructor(permissionsSet) {
    this.permissionsSet = permissionsSet;
  }

  /**
   * Check if user has permission
   * @param {string} entity - Entity name
   * @param {string} action - Action name
   * @returns {boolean} True if user has permission
   */
  can(entity, action) {
    if (!this.permissionsSet || this.permissionsSet.size === 0) {
      return false;
    }
    const key = generatePermissionKey(entity, action);
    return this.permissionsSet.has(key);
  }

  /**
   * Check if user cannot perform action (inverse of can)
   * @param {string} entity - Entity name
   * @param {string} action - Action name
   * @returns {boolean} True if user does NOT have permission
   */
  cannot(entity, action) {
    return !this.can(entity, action);
  }

  /**
   * Check if user has all specified permissions
   * @param {Array<{entity: string, action: string}>} permissions
   * @returns {boolean} True if user has all permissions
   */
  canAll(permissions) {
    return permissions.every(({ entity, action }) => this.can(entity, action));
  }

  /**
   * Check if user has any of the specified permissions
   * @param {Array<{entity: string, action: string}>} permissions
   * @returns {boolean} True if user has at least one permission
   */
  canAny(permissions) {
    return permissions.some(({ entity, action }) => this.can(entity, action));
  }
}

/**
 * Format permission for display
 * @param {Object} permission - Permission object
 * @returns {string} Formatted permission string
 */
export const formatPermissionDisplay = (permission) => {
  return `${permission.entity}.${permission.action}`;
};

/**
 * Common permission sets for different user types
 * Can be used as reference or for testing
 */
export const COMMON_PERMISSIONS = {
  DASHBOARD_FULL: [
    { entity: 'dashboard', action: 'read' },
    { entity: 'dashboard', action: 'write' }
  ],
  TASKS_READ_ONLY: [
    { entity: 'tasks', action: 'read' }
  ],
  TASKS_FULL: [
    { entity: 'tasks', action: 'read' },
    { entity: 'tasks', action: 'write' },
    { entity: 'tasks', action: 'delete' },
    { entity: 'tasks', action: 'assign' }
  ],
  SETTINGS_FULL: [
    { entity: 'settings', action: 'read' },
    { entity: 'settings', action: 'write' }
  ]
};

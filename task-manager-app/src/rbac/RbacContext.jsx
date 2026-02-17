import React, { createContext, useContext, useState, useMemo } from 'react';

/**
 * RBAC Context
 * Provides permission checking functionality throughout the application
 */
const RbacContext = createContext(null);

/**
 * RBAC Provider Component
 * Manages permission state and provides utility functions
 */
export const RbacProvider = ({ children }) => {
  // Store permissions as both Set (for fast lookup) and Map (for metadata)
  const [permissionsSet, setPermissionsSet] = useState(new Set());
  const [permissionsMap, setPermissionsMap] = useState(new Map());
  const [userRoles, setUserRoles] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize permissions from API response
   * @param {Object} data - User permissions data from API
   * @param {Array} data.permissions - Array of permission objects
   * @param {Array} data.roles - Array of role objects
   */
  const initializePermissions = (data) => {
    const newPermissionsSet = new Set();
    const newPermissionsMap = new Map();

    // Process each permission and create dual-index structure
    data.permissions.forEach(permission => {
      const key = `${permission.entity}_${permission.action}`;
      newPermissionsSet.add(key);
      newPermissionsMap.set(key, permission);
    });

    setPermissionsSet(newPermissionsSet);
    setPermissionsMap(newPermissionsMap);
    setUserRoles(data.roles || []);
    setIsInitialized(true);
  };

  /**
   * Clear all permissions (useful for logout)
   */
  const clearPermissions = () => {
    setPermissionsSet(new Set());
    setPermissionsMap(new Map());
    setUserRoles([]);
    setIsInitialized(false);
  };

  /**
   * Check if user has a specific permission
   * @param {string} entity - Entity name (e.g., 'dashboard', 'tasks')
   * @param {string} action - Action name (e.g., 'read', 'write', 'delete')
   * @returns {boolean} True if user has permission
   */
  const hasPermission = (entity, action) => {
    if (!isInitialized) return false;
    const key = `${entity}_${action}`;
    return permissionsSet.has(key);
  };

  /**
   * Get permission metadata
   * @param {string} entity - Entity name
   * @param {string} action - Action name
   * @returns {Object|null} Permission object with metadata or null
   */
  const getPermissionDetails = (entity, action) => {
    const key = `${entity}_${action}`;
    return permissionsMap.get(key) || null;
  };

  /**
   * Check if user has a specific role
   * @param {string} roleName - Role name to check
   * @returns {boolean} True if user has the role
   */
  const hasRole = (roleName) => {
    return userRoles.some(role => role.name === roleName);
  };

  /**
   * Check if user has any of the provided roles
   * @param {Array<string>} roleNames - Array of role names
   * @returns {boolean} True if user has at least one role
   */
  const hasAnyRole = (roleNames) => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  /**
   * Check if user has all of the provided roles
   * @param {Array<string>} roleNames - Array of role names
   * @returns {boolean} True if user has all roles
   */
  const hasAllRoles = (roleNames) => {
    return roleNames.every(roleName => hasRole(roleName));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isInitialized,
      permissionsSet,
      permissionsMap,
      userRoles,
      initializePermissions,
      clearPermissions,
      hasPermission,
      getPermissionDetails,
      hasRole,
      hasAnyRole,
      hasAllRoles,
    }),
    [isInitialized, permissionsSet, permissionsMap, userRoles]
  );

  return (
    <RbacContext.Provider value={contextValue}>
      {children}
    </RbacContext.Provider>
  );
};

/**
 * Hook to access RBAC context
 * @throws {Error} If used outside RbacProvider
 */
export const useRbacContext = () => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbacContext must be used within RbacProvider');
  }
  return context;
};

/**
 * Hook to check a single permission
 * @param {string} entity - Entity name
 * @param {string} action - Action name
 * @returns {boolean} True if user has permission
 */
export const usePermission = (entity, action) => {
  const { hasPermission } = useRbacContext();
  return useMemo(() => hasPermission(entity, action), [hasPermission, entity, action]);
};

/**
 * Hook to check multiple permissions for an entity
 * @param {string} entity - Entity name
 * @param {Array<string>} actions - Array of action names
 * @returns {Object} Object with action names as keys and boolean values
 */
export const usePermissions = (entity, actions = []) => {
  const { hasPermission } = useRbacContext();

  return useMemo(() => {
    const permissions = {};
    actions.forEach(action => {
      permissions[action] = hasPermission(entity, action);
    });
    return permissions;
  }, [hasPermission, entity, actions]);
};

/**
 * Imperative IAMUtil function for permission checks
 * Use this when you need to check permissions outside of React components
 * or in event handlers, callbacks, etc.
 *
 * Note: This must be called after permissions are initialized
 *
 * @param {Set} permissionsSet - The permissions Set from context
 * @returns {Function} Function that takes (entity, action) and returns boolean
 */
export const createIAMUtil = (permissionsSet) => {
  return (entity, action) => {
    if (!permissionsSet || permissionsSet.size === 0) {
      return false;
    }
    const key = `${entity}_${action}`;
    return permissionsSet.has(key);
  };
};

/**
 * Hook to get the IAMUtil function
 * @returns {Function} IAMUtil function that accepts (entity, action) and returns boolean
 */
export const useIAMUtil = () => {
  const { permissionsSet } = useRbacContext();
  return useMemo(() => createIAMUtil(permissionsSet), [permissionsSet]);
};

/**
 * RBAC Module - Main Export
 * Simple, performant Role-Based Access Control for React applications
 *
 * Usage:
 * 1. Wrap your app with RbacProvider
 * 2. Initialize permissions after login using initializePermissions
 * 3. Use hooks or components to check permissions:
 *    - usePermission(entity, action) - Hook for single permission
 *    - useIAMUtil() - Get IAMUtil function for imperative checks
 *    - <Can entity="..." action="..."> - Declarative wrapper
 *    - <ProtectedRoute entity="..." action="..."> - Route protection
 */

// Context and Provider
export { RbacProvider, useRbacContext } from './RbacContext';

// Hooks
export { usePermission, usePermissions, useIAMUtil } from './RbacContext';

// Components
export { default as Can } from './Can';
export { default as ProtectedRoute } from './ProtectedRoute';

// Utility functions
export {
  IAMUtil,
  generatePermissionKey,
  parsePermissionKey,
  buildPermissionsStructure,
  filterPermissionsByEntity,
  groupPermissionsByEntity,
  getEntityActions,
  hasPermissionInArray,
  formatPermissionDisplay,
  COMMON_PERMISSIONS
} from './permissionUtils';

import React from "react";
import { Shield } from "lucide-react";

/**
 * Check if user has specific permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  
  // Super admin (role=admin) has all permissions by default for backward compatibility
  if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
    return true;
  }
  
  // Check if user has full_admin permission
  if (user.permissions?.includes('full_admin')) {
    return true;
  }
  
  // Check specific permission
  return user.permissions?.includes(permission) || false;
}

/**
 * Component to guard content based on permissions
 */
export default function PermissionsGuard({ user, permission, children, fallback }) {
  if (!hasPermission(user, permission)) {
    if (fallback) return fallback;
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
        <p className="text-gray-400">You don't have permission to access this feature.</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
import { Roles } from 'UI/constants/roles';
import { getCurrentUser } from './Authentication';

export const userHasAdminPermissions = () => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }
  return user.roleId === Roles.Admin || user.roleId === Roles.SuperAdmin;
};

export const userHasAdminOrManagerPermissions = () => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }
  return (
    user.roleId === Roles.Admin ||
    user.roleId === Roles.SuperAdmin ||
    user.roleId === Roles.Warehouse
  );
};

export const userHasEmployeePermissions = () => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }
  return (
    user.roleId === Roles.Admin ||
    user.roleId === Roles.SuperAdmin ||
    user.roleId === Roles.Warehouse ||
    user.roleId === Roles.Sales
  );
};

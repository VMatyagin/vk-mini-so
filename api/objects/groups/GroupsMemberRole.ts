/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsMemberRolePermission } from './GroupsMemberRolePermission';
import { GroupsMemberRoleStatus } from './GroupsMemberRoleStatus';

// groups_member_role
export interface GroupsMemberRole {
  /**
   * User ID
   */
  id?: number;
  permissions?: GroupsMemberRolePermission[];
  role?: GroupsMemberRoleStatus;
}

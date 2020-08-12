/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsGroupXtrInvitedByAdminLevel } from './GroupsGroupXtrInvitedByAdminLevel';
import { GroupsGroupXtrInvitedByType } from './GroupsGroupXtrInvitedByType';

// groups_group_xtr_invited_by
export interface GroupsGroupXtrInvitedBy {
  admin_level?: GroupsGroupXtrInvitedByAdminLevel;
  /**
   * Community ID
   */
  id?: number;
  /**
   * Inviter ID
   */
  invited_by?: number;
  /**
   * Information whether current user is manager
   */
  is_admin?: 0 | 1;
  /**
   * Information whether current user is advertiser
   */
  is_advertiser?: 0 | 1;
  /**
   * Information whether community is closed
   */
  is_closed?: 0 | 1;
  /**
   * Information whether current user is member
   */
  is_member?: 0 | 1;
  /**
   * Community name
   */
  name?: string;
  /**
   * URL of square photo of the community with 100 pixels in width
   */
  photo_100?: string;
  /**
   * URL of square photo of the community with 200 pixels in width
   */
  photo_200?: string;
  /**
   * URL of square photo of the community with 50 pixels in width
   */
  photo_50?: string;
  /**
   * Domain of the community page
   */
  screen_name?: string;
  type?: GroupsGroupXtrInvitedByType;
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsGroupAdminLevel } from './GroupsGroupAdminLevel';
import { GroupsGroupIsClosed } from './GroupsGroupIsClosed';
import { GroupsGroupType } from './GroupsGroupType';

// groups_group
export interface GroupsGroup {
  admin_level?: GroupsGroupAdminLevel;
  /**
   * Information whether community is banned
   */
  deactivated?: string;
  /**
   * Finish date in Unixtime format
   */
  finish_date?: number;
  /**
   * Community ID
   */
  id?: number;
  /**
   * Information whether current user is administrator
   */
  is_admin?: 0 | 1;
  /**
   * Information whether current user is advertiser
   */
  is_advertiser?: 0 | 1;
  is_closed?: GroupsGroupIsClosed;
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
  /**
   * Start date in Unixtime format
   */
  start_date?: number;
  type?: GroupsGroupType;
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsBanInfoReason } from './GroupsBanInfoReason';

// groups_group_ban_info
export interface GroupsGroupBanInfo {
  /**
   * Ban comment
   */
  comment?: string;
  /**
   * End date of ban in Unixtime
   */
  end_date?: number;
  reason?: GroupsBanInfoReason;
}

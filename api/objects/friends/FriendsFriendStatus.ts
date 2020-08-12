/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { FriendsFriendStatusStatus } from './FriendsFriendStatusStatus';

// friends_friend_status
export interface FriendsFriendStatus {
  friend_status: FriendsFriendStatusStatus;
  /**
   * MD5 hash for the result validation
   */
  sign?: string;
  /**
   * User ID
   */
  user_id: number;
}

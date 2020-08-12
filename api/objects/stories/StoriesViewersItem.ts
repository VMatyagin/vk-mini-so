/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { UsersUserFull } from '../users/UsersUserFull';

// stories_viewers_item
export interface StoriesViewersItem {
  /**
   * user has like for this object
   */
  is_liked: boolean;
  /**
   * user id
   */
  user_id: number;
  user?: UsersUserFull;
}

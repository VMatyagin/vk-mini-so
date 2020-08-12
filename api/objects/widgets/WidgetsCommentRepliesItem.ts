/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { UsersUserFull } from '../users/UsersUserFull';
import { WidgetsWidgetLikes } from './WidgetsWidgetLikes';

// widgets_comment_replies_item
export interface WidgetsCommentRepliesItem {
  /**
   * Comment ID
   */
  cid?: number;
  /**
   * Date when the comment has been added in Unixtime
   */
  date?: number;
  likes?: WidgetsWidgetLikes;
  /**
   * Comment text
   */
  text?: string;
  /**
   * User ID
   */
  uid?: number;
  user?: UsersUserFull;
}

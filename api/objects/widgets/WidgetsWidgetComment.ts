/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseLikesInfo } from '../base/BaseLikesInfo';
import { BaseRepostsInfo } from '../base/BaseRepostsInfo';
import { UsersUserFull } from '../users/UsersUserFull';
import { WallCommentAttachment } from '../wall/WallCommentAttachment';
import { WallPostSource } from '../wall/WallPostSource';
import { WidgetsCommentMedia } from './WidgetsCommentMedia';
import { WidgetsCommentReplies } from './WidgetsCommentReplies';

// widgets_widget_comment
export interface WidgetsWidgetComment {
  attachments?: WallCommentAttachment[];
  /**
   * Information whether current user can delete the comment
   */
  can_delete?: 0 | 1;
  comments?: WidgetsCommentReplies;
  /**
   * Date when the comment has been added in Unixtime
   */
  date: number;
  /**
   * Comment author ID
   */
  from_id: number;
  /**
   * Comment ID
   */
  id: number;
  likes?: BaseLikesInfo;
  media?: WidgetsCommentMedia;
  post_source?: WallPostSource;
  /**
   * Post type
   */
  post_type: number;
  reposts?: BaseRepostsInfo;
  /**
   * Comment text
   */
  text: string;
  /**
   * Wall owner
   */
  to_id: number;
  user?: UsersUserFull;
}

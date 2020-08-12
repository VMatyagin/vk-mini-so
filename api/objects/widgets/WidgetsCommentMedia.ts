/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { WidgetsCommentMediaType } from './WidgetsCommentMediaType';

// widgets_comment_media
export interface WidgetsCommentMedia {
  /**
   * Media item ID
   */
  item_id?: number;
  /**
   * Media owner's ID
   */
  owner_id?: number;
  /**
   * URL of the preview image (type=photo only)
   */
  thumb_src?: string;
  type?: WidgetsCommentMediaType;
}

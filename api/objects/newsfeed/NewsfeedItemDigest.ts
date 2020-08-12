/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { WallWallpost } from '../wall/WallWallpost';
import { NewsfeedNewsfeedItemType } from './NewsfeedNewsfeedItemType';

// newsfeed_item_digest template enum
export enum NewsfeedItemDigestTemplateEnum {
  LIST = 'list',
  GRID = 'grid',
}

// newsfeed_item_digest
export interface NewsfeedItemDigest {
  type: NewsfeedNewsfeedItemType;
  /**
   * Item source ID
   */
  source_id: number;
  /**
   * Date when item has been added in Unixtime
   */
  date: number;
  button_text?: string;
  /**
   * id of feed in digest
   */
  feed_id?: string;
  items?: WallWallpost[];
  main_post_ids?: string[];
  /**
   * type of digest
   */
  template?: NewsfeedItemDigestTemplateEnum;
  title?: string;
  track_code?: string;
}

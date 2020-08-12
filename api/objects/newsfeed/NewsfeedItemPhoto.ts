/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { NewsfeedItemPhotoPhotos } from './NewsfeedItemPhotoPhotos';
import { NewsfeedNewsfeedItemType } from './NewsfeedNewsfeedItemType';

// newsfeed_item_photo
export interface NewsfeedItemPhoto {
  /**
   * Index of current carousel element
   */
  carousel_offset?: number;
  type: NewsfeedNewsfeedItemType;
  /**
   * Item source ID
   */
  source_id: number;
  /**
   * Date when item has been added in Unixtime
   */
  date: number;
  photos?: NewsfeedItemPhotoPhotos;
  /**
   * Post ID
   */
  post_id?: number;
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseLikes } from '../base/BaseLikes';
import { BaseObjectCount } from '../base/BaseObjectCount';
import { MediaRestriction } from '../media/MediaRestriction';
import { PhotosImage } from '../photos/PhotosImage';
import { PhotosPhotoSizes } from '../photos/PhotosPhotoSizes';

// newsfeed_newsfeed_photo
export interface NewsfeedNewsfeedPhoto {
  /**
   * Access key for the photo
   */
  access_key?: string;
  /**
   * Album ID
   */
  album_id: number;
  /**
   * Date when uploaded
   */
  date: number;
  /**
   * Original photo height
   */
  height?: number;
  /**
   * Photo ID
   */
  id: number;
  images?: PhotosImage[];
  /**
   * Latitude
   */
  lat?: number;
  /**
   * Longitude
   */
  long?: number;
  /**
   * Photo owner's ID
   */
  owner_id: number;
  /**
   * URL of image with 2560 px width
   */
  photo_256?: string;
  /**
   * Information whether current user can comment the photo
   */
  can_comment?: 0 | 1;
  place?: string;
  /**
   * Post ID
   */
  post_id?: number;
  sizes?: PhotosPhotoSizes[];
  /**
   * Photo caption
   */
  text?: string;
  /**
   * ID of the user who have uploaded the photo
   */
  user_id?: number;
  /**
   * Original photo width
   */
  width?: number;
  /**
   * Whether photo has attached tag links
   */
  has_tags: boolean;
  restrictions?: MediaRestriction;
  likes?: BaseLikes;
  comments?: BaseObjectCount;
  /**
   * Information whether current user can repost the photo
   */
  can_repost?: 0 | 1;
}

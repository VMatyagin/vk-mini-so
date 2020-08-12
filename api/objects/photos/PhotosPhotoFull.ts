/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseLikes } from '../base/BaseLikes';
import { BaseObjectCount } from '../base/BaseObjectCount';
import { PhotosImage } from './PhotosImage';

// photos_photo_full
export interface PhotosPhotoFull {
  /**
   * Access key for the photo
   */
  access_key?: string;
  /**
   * Album ID
   */
  album_id: number;
  /**
   * Information whether current user can comment the photo
   */
  can_comment?: 0 | 1;
  comments?: BaseObjectCount;
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
  likes?: BaseLikes;
  /**
   * Longitude
   */
  long?: number;
  /**
   * Photo owner's ID
   */
  owner_id: number;
  /**
   * Post ID
   */
  post_id?: number;
  reposts?: BaseObjectCount;
  tags?: BaseObjectCount;
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
}

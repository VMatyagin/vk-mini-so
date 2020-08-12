/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { PhotosPhotoSizes } from './PhotosPhotoSizes';

// photos_photo_xtr_real_offset
export interface PhotosPhotoXtrRealOffset {
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
   * Returns if the photo is hidden above the wall
   */
  hidden?: 1;
  /**
   * Photo ID
   */
  id: number;
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
   * URL of image with 1280 px width
   */
  photo_1280?: string;
  /**
   * URL of image with 130 px width
   */
  photo_130?: string;
  /**
   * URL of image with 2560 px width
   */
  photo_2560?: string;
  /**
   * URL of image with 604 px width
   */
  photo_604?: string;
  /**
   * URL of image with 75 px width
   */
  photo_75?: string;
  /**
   * URL of image with 807 px width
   */
  photo_807?: string;
  /**
   * Post ID
   */
  post_id?: number;
  /**
   * Real position of the photo
   */
  real_offset?: number;
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
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { VideoVideoImage } from './VideoVideoImage';

// video_video_album_full
export interface VideoVideoAlbumFull {
  /**
   * Total number of videos in album
   */
  count: number;
  /**
   * Album ID
   */
  id?: number;
  /**
   * Album cover image in different sizes
   */
  image?: VideoVideoImage[];
  /**
   * Need blur album thumb or not
   */
  image_blur?: 1;
  /**
   * Information whether album is system
   */
  is_system?: 1;
  /**
   * Album owner's ID
   */
  owner_id: number;
  /**
   * Album title
   */
  title: string;
  /**
   * Date when the album has been updated last time in Unixtime
   */
  updated_time: number;
}

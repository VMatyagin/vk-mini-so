/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { NewsfeedItemAudioAudio } from './NewsfeedItemAudioAudio';
import { NewsfeedNewsfeedItemType } from './NewsfeedNewsfeedItemType';

// newsfeed_item_audio
export interface NewsfeedItemAudio {
  type: NewsfeedNewsfeedItemType;
  /**
   * Item source ID
   */
  source_id: number;
  /**
   * Date when item has been added in Unixtime
   */
  date: number;
  audio?: NewsfeedItemAudioAudio;
  /**
   * Post ID
   */
  post_id?: number;
}

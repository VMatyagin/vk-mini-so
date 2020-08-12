/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { NewsfeedItemNoteNotes } from './NewsfeedItemNoteNotes';
import { NewsfeedNewsfeedItemType } from './NewsfeedNewsfeedItemType';

// newsfeed_item_note
export interface NewsfeedItemNote {
  type: NewsfeedNewsfeedItemType;
  /**
   * Item source ID
   */
  source_id: number;
  /**
   * Date when item has been added in Unixtime
   */
  date: number;
  notes?: NewsfeedItemNoteNotes;
}

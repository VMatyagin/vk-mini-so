/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { NewsfeedItemWallpostFeedbackAnswer } from './NewsfeedItemWallpostFeedbackAnswer';
import { NewsfeedItemWallpostFeedbackType } from './NewsfeedItemWallpostFeedbackType';

// newsfeed_item_wallpost_feedback
export interface NewsfeedItemWallpostFeedback {
  type: NewsfeedItemWallpostFeedbackType;
  question: string;
  answers?: NewsfeedItemWallpostFeedbackAnswer[];
  stars_count?: number;
  gratitude?: string;
}

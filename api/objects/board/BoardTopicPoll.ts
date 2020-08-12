/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { PollsAnswer } from '../polls/PollsAnswer';

// board_topic_poll
export interface BoardTopicPoll {
  /**
   * Current user's answer ID
   */
  answer_id: number;
  answers: PollsAnswer[];
  /**
   * Date when poll has been created in Unixtime
   */
  created: number;
  /**
   * Information whether the poll is closed
   */
  is_closed?: 0 | 1;
  /**
   * Poll owner's ID
   */
  owner_id: number;
  /**
   * Poll ID
   */
  poll_id: number;
  /**
   * Poll question
   */
  question: string;
  /**
   * Votes number
   */
  votes: string;
}

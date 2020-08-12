/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { LeadsChecked } from '../objects/leads/LeadsChecked';
import { LeadsComplete } from '../objects/leads/LeadsComplete';
import { LeadsEntry } from '../objects/leads/LeadsEntry';
import { LeadsLead } from '../objects/leads/LeadsLead';
import { LeadsStart } from '../objects/leads/LeadsStart';

/**
 * leads.checkUser
 *
 * Checks if the user can start the lead.
 */

export interface LeadsCheckUserParams {
  /**
   * Lead ID.
   */
  lead_id: number;
  /**
   * Value to be return in 'result' field when test mode is used.
   */
  test_result?: number;
  test_mode?: 0 | 1;
  auto_start?: 0 | 1;
  /**
   * User age.
   */
  age?: number;
  /**
   * User country code.
   */
  country?: string;
}

// leads.checkUser_response
export type LeadsCheckUserResponse = LeadsChecked;

/**
 * leads.complete
 *
 * Completes the lead started by user.
 */

export interface LeadsCompleteParams {
  /**
   * Session obtained as GET parameter when session started.
   */
  vk_sid: string;
  /**
   * Secret key from the lead testing interface.
   */
  secret: string;
  /**
   * Comment text.
   */
  comment?: string;
}

// leads.complete_response
export type LeadsCompleteResponse = LeadsComplete;

/**
 * leads.getStats
 *
 * Returns lead stats data.
 */

export interface LeadsGetStatsParams {
  /**
   * Lead ID.
   */
  lead_id: number;
  /**
   * Secret key obtained from the lead testing interface.
   */
  secret?: string;
  /**
   * Day to start stats from (YYYY_MM_DD, e.g.2011-09-17).
   */
  date_start?: string;
  /**
   * Day to finish stats (YYYY_MM_DD, e.g.2011-09-17).
   */
  date_end?: string;
}

// leads.getStats_response
export type LeadsGetStatsResponse = LeadsLead;

/**
 * leads.getUsers
 *
 * Returns a list of last user actions for the offer.
 */

export interface LeadsGetUsersParams {
  /**
   * Offer ID.
   */
  offer_id: number;
  /**
   * Secret key obtained in the lead testing interface.
   */
  secret: string;
  /**
   * Offset needed to return a specific subset of results.
   */
  offset?: number;
  /**
   * Number of results to return.
   */
  count?: number;
  /**
   * Action type. Possible values: *'0' — start,, *'1' — finish,, *'2' — blocking users,, *'3' — start in a test mode,, *'4' — finish in a test mode.
   */
  status?: 0 | 1 | 2 | 3 | 4;
  /**
   * Sort order. Possible values: *'1' — chronological,, *'0' — reverse chronological.
   */
  reverse?: 0 | 1;
}

// leads.getUsers_response
export type LeadsGetUsersResponse = LeadsEntry[];

/**
 * leads.metricHit
 *
 * Counts the metric event.
 */

export interface LeadsMetricHitParams {
  /**
   * Metric data obtained in the lead interface.
   */
  data: string;
}

// leads.metricHit_response
export interface LeadsMetricHitResponse {
  /**
   * Information whether request has been processed successfully
   */
  result?: boolean;
  /**
   * Redirect link
   */
  redirect_link?: string;
}

/**
 * leads.start
 *
 * Creates new session for the user passing the offer.
 */

export interface LeadsStartParams {
  /**
   * Lead ID.
   */
  lead_id: number;
  /**
   * Secret key from the lead testing interface.
   */
  secret: string;
  uid?: number;
  aid?: number;
  test_mode?: 0 | 1;
  force?: 0 | 1;
}

// leads.start_response
export type LeadsStartResponse = LeadsStart;

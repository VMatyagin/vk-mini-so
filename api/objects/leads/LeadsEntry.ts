/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// leads_entry
export interface LeadsEntry {
  /**
   * Application ID
   */
  aid?: number;
  /**
   * Comment text
   */
  comment?: string;
  /**
   * Date when the action has been started in Unixtime
   */
  date?: number;
  /**
   * Session string ID
   */
  sid?: string;
  /**
   * Start date in Unixtime (for status=2)
   */
  start_date?: number;
  /**
   * Action type
   */
  status?: number;
  /**
   * Information whether test mode is enabled
   */
  test_mode?: 0 | 1;
  /**
   * User ID
   */
  uid?: number;
}

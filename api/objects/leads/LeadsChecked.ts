/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { LeadsCheckedResult } from './LeadsCheckedResult';

// leads_checked
export interface LeadsChecked {
  /**
   * Reason why user can't start the lead
   */
  reason?: string;
  result?: LeadsCheckedResult;
  /**
   * Session ID
   */
  sid?: string;
  /**
   * URL user should open to start the lead
   */
  start_link?: string;
}

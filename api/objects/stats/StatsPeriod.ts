/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { StatsActivity } from './StatsActivity';
import { StatsReach } from './StatsReach';
import { StatsViews } from './StatsViews';

// stats_period
export interface StatsPeriod {
  activity?: StatsActivity;
  /**
   * Unix timestamp
   */
  period_from?: number;
  /**
   * Unix timestamp
   */
  period_to?: number;
  reach?: StatsReach;
  visitors?: StatsViews;
}

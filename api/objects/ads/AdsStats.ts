/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AdsObjectType } from './AdsObjectType';
import { AdsStatsFormat } from './AdsStatsFormat';
import { AdsStatsViewsTimes } from './AdsStatsViewsTimes';

// ads_stats
export interface AdsStats {
  /**
   * Object ID
   */
  id?: number;
  stats?: AdsStatsFormat;
  type?: AdsObjectType;
  views_times?: AdsStatsViewsTimes;
}

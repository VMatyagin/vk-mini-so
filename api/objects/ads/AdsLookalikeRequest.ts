/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AdsLookalikeRequestSaveAudienceLevel } from './AdsLookalikeRequestSaveAudienceLevel';

// ads_lookalike_request status enum
export enum AdsLookalikeRequestStatusEnum {
  SEARCH_IN_PROGRESS = 'search_in_progress',
  SEARCH_FAILED = 'search_failed',
  SEARCH_DONE = 'search_done',
  SAVE_IN_PROGRESS = 'save_in_progress',
  SAVE_FAILED = 'save_failed',
  SAVE_DONE = 'save_done',
}

// ads_lookalike_request source_type enum
export enum AdsLookalikeRequestSourceTypeEnum {
  RETARGETING_GROUP = 'retargeting_group',
}

// ads_lookalike_request
export interface AdsLookalikeRequest {
  /**
   * Lookalike request ID
   */
  id: number;
  /**
   * Lookalike request create time, as Unixtime
   */
  create_time: number;
  /**
   * Lookalike request update time, as Unixtime
   */
  update_time: number;
  /**
   * Time by which lookalike request would be deleted, as Unixtime
   */
  scheduled_delete_time?: number;
  /**
   * Lookalike request status
   */
  status: AdsLookalikeRequestStatusEnum;
  /**
   * Lookalike request source type
   */
  source_type: AdsLookalikeRequestSourceTypeEnum;
  /**
   * Retargeting group id, which was used as lookalike seed
   */
  source_retargeting_group_id?: number;
  /**
   * Lookalike request seed name (retargeting group name)
   */
  source_name?: string;
  /**
   * Lookalike request seed audience size
   */
  audience_count?: number;
  save_audience_levels?: AdsLookalikeRequestSaveAudienceLevel[];
}

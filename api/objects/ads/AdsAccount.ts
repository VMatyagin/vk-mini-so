/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AdsAccessRole } from './AdsAccessRole';
import { AdsAccountType } from './AdsAccountType';

// ads_account
export interface AdsAccount {
  access_role: AdsAccessRole;
  /**
   * Account ID
   */
  account_id: number;
  /**
   * Information whether account is active
   */
  account_status: 0 | 1;
  account_type: AdsAccountType;
  /**
   * Account name
   */
  account_name: string;
}

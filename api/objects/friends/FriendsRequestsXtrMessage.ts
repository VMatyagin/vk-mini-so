/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { FriendsRequestsMutual } from './FriendsRequestsMutual';

// friends_requests_xtr_message
export interface FriendsRequestsXtrMessage {
  /**
   * ID of the user by whom friend has been suggested
   */
  from?: string;
  /**
   * Message sent with a request
   */
  message?: string;
  mutual?: FriendsRequestsMutual;
  /**
   * User ID
   */
  user_id?: number;
}

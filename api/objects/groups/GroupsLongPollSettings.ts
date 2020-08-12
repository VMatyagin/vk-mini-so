/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsLongPollEvents } from './GroupsLongPollEvents';

// groups_long_poll_settings
export interface GroupsLongPollSettings {
  /**
   * API version used for the events
   */
  api_version?: string;
  events: GroupsLongPollEvents;
  /**
   * Shows whether Long Poll is enabled
   */
  is_enabled: boolean;
}

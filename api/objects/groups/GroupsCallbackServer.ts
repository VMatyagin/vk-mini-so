/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// groups_callback_server status enum
export enum GroupsCallbackServerStatusEnum {
  UNCONFIGURED = 'unconfigured',
  FAILED = 'failed',
  WAIT = 'wait',
  OK = 'ok',
}

// groups_callback_server
export interface GroupsCallbackServer {
  id: number;
  title: string;
  creator_id: number;
  url: string;
  secret_key: string;
  status: GroupsCallbackServerStatusEnum;
}

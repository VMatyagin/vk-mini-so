/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { MessagesConversationPeer } from './MessagesConversationPeer';
import { MessagesKeyboard } from './MessagesKeyboard';
import { MessagesMessageRequestData } from './MessagesMessageRequestData';

// messages_conversation special_service_type enum
export enum MessagesConversationSpecialServiceTypeEnum {
  BUSINESS_NOTIFY = 'business_notify',
}

// messages_conversation
export interface MessagesConversation {
  peer: MessagesConversationPeer;
  /**
   * ID of the last message in conversation
   */
  last_message_id: number;
  /**
   * Last message user have read
   */
  in_read: number;
  /**
   * Last outcoming message have been read by the opponent
   */
  out_read: number;
  /**
   * Unread messages number
   */
  unread_count?: number;
  /**
   * Is this conversation uread
   */
  is_marked_unread?: boolean;
  important?: boolean;
  unanswered?: boolean;
  special_service_type?: MessagesConversationSpecialServiceTypeEnum;
  message_request_data?: MessagesMessageRequestData;
  /**
   * Ids of messages with mentions
   */
  mentions?: number[];
  current_keyboard?: MessagesKeyboard;
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// messages_conversation_member
export interface MessagesConversationMember {
  /**
   * Is it possible for user to kick this member
   */
  can_kick?: boolean;
  invited_by?: number;
  is_admin?: boolean;
  is_owner?: boolean;
  is_message_request?: boolean;
  join_date?: number;
  /**
   * Message request date
   */
  request_date?: number;
  member_id: number;
}

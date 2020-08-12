/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

/**
 * auth.checkPhone
 *
 * Checks a user's phone number for correctness.
 */

export interface AuthCheckPhoneParams {
  /**
   * Phone number.
   */
  phone: string;
  /**
   * User ID.
   */
  client_id?: number;
  client_secret?: string;
  auth_by_phone?: 0 | 1;
}

// auth.checkPhone_response
export type AuthCheckPhoneResponse = 1;

/**
 * auth.restore
 *
 * Allows to restore account access using a code received via SMS. " This method is only available for apps with [vk.com/dev/auth_direct|Direct authorization] access. "
 */

export interface AuthRestoreParams {
  /**
   * User phone number.
   */
  phone: string;
  /**
   * User last name.
   */
  last_name: string;
}

// auth.restore_response success enum
export enum AuthRestoreResponseSuccessEnum {
  OK = 1,
}

// auth.restore_response
export interface AuthRestoreResponse {
  /**
   * 1 if success
   */
  success?: AuthRestoreResponseSuccessEnum;
  /**
   * Parameter needed to grant access by code
   */
  sid?: string;
}

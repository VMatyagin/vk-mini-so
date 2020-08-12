/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// users_relative type enum
export enum UsersRelativeTypeEnum {
  PARENT = 'parent',
  CHILD = 'child',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  SIBLING = 'sibling',
}

// users_relative
export interface UsersRelative {
  /**
   * Date of child birthday (format dd.mm.yyyy)
   */
  birth_date?: string;
  /**
   * Relative ID
   */
  id?: number;
  /**
   * Name of relative
   */
  name?: string;
  /**
   * Relative type
   */
  type: UsersRelativeTypeEnum;
}

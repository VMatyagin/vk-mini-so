/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseLinkButtonAction } from './BaseLinkButtonAction';
import { BaseLinkButtonStyle } from './BaseLinkButtonStyle';

// base_link_button
export interface BaseLinkButton {
  /**
   * Button action
   */
  action?: BaseLinkButtonAction;
  /**
   * Button title
   */
  title?: string;
  /**
   * Target block id
   */
  block_id?: string;
  /**
   * Target section id
   */
  section_id?: string;
  /**
   * Owner id
   */
  owner_id?: number;
  /**
   * Button icon name, e.g. 'phone' or 'gift'
   */
  icon?: string;
  style?: BaseLinkButtonStyle;
}

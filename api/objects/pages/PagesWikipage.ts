/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { PagesPrivacySettings } from './PagesPrivacySettings';

// pages_wikipage
export interface PagesWikipage {
  /**
   * Page creator ID
   */
  creator_id?: number;
  /**
   * Page creator name
   */
  creator_name?: number;
  /**
   * Last editor ID
   */
  editor_id?: number;
  /**
   * Last editor name
   */
  editor_name?: string;
  /**
   * Community ID
   */
  group_id: number;
  /**
   * Page ID
   */
  id: number;
  /**
   * Page title
   */
  title: string;
  /**
   * Views number
   */
  views: number;
  /**
   * Edit settings of the page
   */
  who_can_edit: PagesPrivacySettings;
  /**
   * View settings of the page
   */
  who_can_view: PagesPrivacySettings;
}

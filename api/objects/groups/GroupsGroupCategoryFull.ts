/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { GroupsGroup } from './GroupsGroup';
import { GroupsGroupCategory } from './GroupsGroupCategory';

// groups_group_category_full
export interface GroupsGroupCategoryFull {
  /**
   * Category ID
   */
  id: number;
  /**
   * Category name
   */
  name: string;
  /**
   * Pages number
   */
  page_count: number;
  page_previews: GroupsGroup[];
  subcategories?: GroupsGroupCategory[];
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseLikes } from '../base/BaseLikes';
import { BaseRepostsInfo } from '../base/BaseRepostsInfo';
import { PhotosPhoto } from '../photos/PhotosPhoto';
import { MarketMarketCategory } from './MarketMarketCategory';
import { MarketMarketItemAvailability } from './MarketMarketItemAvailability';
import { MarketPrice } from './MarketPrice';

// market_market_item_full
export interface MarketMarketItemFull {
  /**
   * Access key for the market item
   */
  access_key?: string;
  availability: MarketMarketItemAvailability;
  /**
   * Title for button for url
   */
  button_title?: string;
  category: MarketMarketCategory;
  /**
   * Date when the item has been created in Unixtime
   */
  date?: number;
  /**
   * Item description
   */
  description: string;
  external_id?: string;
  /**
   * Item ID
   */
  id: number;
  is_favorite?: boolean;
  /**
   * Item owner's ID
   */
  owner_id: number;
  price: MarketPrice;
  /**
   * URL of the preview image
   */
  thumb_photo: string;
  /**
   * Item title
   */
  title: string;
  /**
   * URL to item
   */
  url?: string;
  variants_grouping_id?: number;
  is_main_variant?: boolean;
  albums_ids?: number[];
  photos?: PhotosPhoto[];
  /**
   * Information whether current use can comment the item
   */
  can_comment?: 0 | 1;
  /**
   * Information whether current use can repost the item
   */
  can_repost?: 0 | 1;
  likes?: BaseLikes;
  reposts?: BaseRepostsInfo;
  /**
   * Views number
   */
  views_count?: number;
}

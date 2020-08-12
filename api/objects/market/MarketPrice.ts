/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { MarketCurrency } from './MarketCurrency';

// market_price
export interface MarketPrice {
  /**
   * Amount
   */
  amount?: string;
  currency?: MarketCurrency;
  discount_rate?: number;
  old_amount?: string;
  /**
   * Text
   */
  text?: string;
}

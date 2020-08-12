/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { SearchHint } from '../objects/search/SearchHint';

/**
 * search.getHints
 *
 * Allows the programmer to do a quick search for any substring.
 */

export interface SearchGetHintsParams {
  /**
   * Search query string.
   */
  q?: string;
  /**
   * Offset for querying specific result subset
   */
  offset?: number;
  /**
   * Maximum number of results to return.
   */
  limit?: number;
  filters?: string[];
  fields?: string[];
  search_global?: 0 | 1;
}

// search.getHints_response
export interface SearchGetHintsResponse {
  count: number;
  items: SearchHint[];
  suggested_queries?: string[];
}

/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BasePlace } from '../base/BasePlace';

// wall_geo
export interface WallGeo {
  /**
   * Coordinates as string. <latitude> <longtitude>
   */
  coordinates?: string;
  place?: BasePlace;
  /**
   * Information whether a map is showed
   */
  showmap?: number;
  /**
   * Place type
   */
  type?: string;
}

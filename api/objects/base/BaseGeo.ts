/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { BaseGeoCoordinates } from './BaseGeoCoordinates';
import { BasePlace } from './BasePlace';

// base_geo
export interface BaseGeo {
  coordinates?: BaseGeoCoordinates;
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

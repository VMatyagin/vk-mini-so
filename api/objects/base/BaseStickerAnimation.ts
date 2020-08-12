/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// base_sticker_animation type enum
export enum BaseStickerAnimationTypeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}

// base_sticker_animation
export interface BaseStickerAnimation {
  /**
   * Type of animation script
   */
  type?: BaseStickerAnimationTypeEnum;
  /**
   * URL of animation script
   */
  url?: string;
}

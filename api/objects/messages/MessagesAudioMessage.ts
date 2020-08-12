/**
 * This is auto-generated file, don't modify this file manually
 */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-interface */

// messages_audio_message
export interface MessagesAudioMessage {
  /**
   * Access key for audio message
   */
  access_key?: string;
  /**
   * Audio message duration in seconds
   */
  duration: number;
  /**
   * Audio message ID
   */
  id: number;
  /**
   * MP3 file URL
   */
  link_mp3: string;
  /**
   * OGG file URL
   */
  link_ogg: string;
  /**
   * Audio message owner ID
   */
  owner_id: number;
  waveform: number[];
}

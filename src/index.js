/**
 * Habibi Baileys
 * Custom WhatsApp Multi-Device Library by HabibiOfficial
 * Based on @whiskeysockets/baileys
 */

import makeWASocket from "@whiskeysockets/baileys";

// Re-export semua dari baileys original
export {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  isJidGroup,
  isJidStatusBroadcast,
  isJidNewsletter,
  isJidBot,
  areJidsSameUser,
  downloadMediaMessage,
  downloadContentFromMessage,
  getContentType,
  generateWAMessageFromContent,
  generateWAMessage,
  prepareWAMessageMedia,
  proto,
  WAProto,
  WAMessageStatus,
  WAMessageStubType,
  extractMessageContent,
  jidNormalizedUser,
  jidDecode,
  jidEncode,
  Browsers,
  BufferJSON,
  generateMessageID,
  generateMessageIDV2,
} from "@whiskeysockets/baileys";

// Export versi library
export const VERSION = "1.0.0";
export const LIB_NAME = "habibi-baileys";
export const AUTHOR = "HabibiOfficial";

// Export utilities
export { createLogger, HabibiLogger } from "./logger.js";
export { HabibiSocket } from "./socket.js";
export { MessageParser } from "./message.js";
export { MediaHelper } from "./media.js";

// Default export — fungsi utama pembuat socket
export default makeWASocket;

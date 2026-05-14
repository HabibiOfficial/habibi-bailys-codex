import { getContentType, extractMessageContent, proto } from "@whiskeysockets/baileys";

/**
 * Helper untuk parsing pesan WhatsApp
 */
export class MessageParser {
  constructor(msg) {
    this.msg = msg;
    this.message = msg.message || {};
    this.key = msg.key || {};
    this.type = getContentType(this.message) || "unknown";
  }

  /** JID pengirim */
  get from() {
    return this.key.remoteJid || "";
  }

  /** Apakah pesan dari grup */
  get isGroup() {
    return this.from.endsWith("@g.us");
  }

  /** JID pengirim asli (dalam grup = peserta, private = JID) */
  get sender() {
    if (this.isGroup) {
      return (this.key.participant || this.msg.participant || "").replace(/:[0-9]+@/, "@");
    }
    return this.from;
  }

  /** Nama pengirim */
  get pushName() {
    return this.msg.pushName || "";
  }

  /** Isi teks pesan */
  get text() {
    const m = this.message;
    return (
      m.conversation ||
      m.extendedTextMessage?.text ||
      m.imageMessage?.caption ||
      m.videoMessage?.caption ||
      m.documentMessage?.caption ||
      m.buttonsResponseMessage?.selectedButtonId ||
      m.listResponseMessage?.singleSelectReply?.selectedRowId ||
      m.templateButtonReplyMessage?.selectedId ||
      ""
    );
  }

  /** Tipe media */
  get mediaType() {
    if (this.type === "imageMessage") return "image";
    if (this.type === "videoMessage") return "video";
    if (this.type === "audioMessage") return "audio";
    if (this.type === "documentMessage") return "document";
    if (this.type === "stickerMessage") return "sticker";
    return null;
  }

  /** Apakah ada media */
  get hasMedia() {
    return this.mediaType !== null;
  }

  /** Quoted message */
  get quoted() {
    const ctx = this.message.extendedTextMessage?.contextInfo;
    if (!ctx?.quotedMessage) return null;
    return {
      key: {
        remoteJid: this.from,
        fromMe: ctx.participant === undefined,
        id: ctx.stanzaId,
        participant: ctx.participant,
      },
      message: ctx.quotedMessage,
    };
  }

  /** Mention JIDs */
  get mentionedJids() {
    return (
      this.message.extendedTextMessage?.contextInfo?.mentionedJid ||
      []
    );
  }

  /** Apakah pesan dari diri sendiri */
  get fromMe() {
    return this.key.fromMe === true;
  }

  /** ID pesan */
  get id() {
    return this.key.id || "";
  }

  /** Timestamp */
  get timestamp() {
    return this.msg.messageTimestamp
      ? Number(this.msg.messageTimestamp) * 1000
      : Date.now();
  }
}

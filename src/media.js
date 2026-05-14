import { downloadMediaMessage } from "@whiskeysockets/baileys";

/**
 * Helper untuk download dan kirim media
 */
export class MediaHelper {
  constructor(sock) {
    this.sock = sock;
  }

  /**
   * Download media dari pesan sebagai Buffer
   * @param {object} msg - Raw WA message
   * @returns {Promise<Buffer>}
   */
  async download(msg) {
    return await downloadMediaMessage(
      msg,
      "buffer",
      {},
      {
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          debug: () => {},
          child: () => ({ info: () => {}, error: () => {}, warn: () => {} }),
        },
      }
    );
  }

  /**
   * Kirim gambar
   */
  async sendImage(jid, source, caption = "", quoted = null) {
    const content =
      typeof source === "string"
        ? { image: { url: source }, caption }
        : { image: source, caption };
    return await this.sock.sendMessage(
      jid,
      content,
      quoted ? { quoted } : {}
    );
  }

  /**
   * Kirim video
   */
  async sendVideo(jid, source, caption = "", quoted = null) {
    const content =
      typeof source === "string"
        ? { video: { url: source }, caption }
        : { video: source, caption };
    return await this.sock.sendMessage(
      jid,
      content,
      quoted ? { quoted } : {}
    );
  }

  /**
   * Kirim audio
   */
  async sendAudio(jid, source, ptt = false, quoted = null) {
    const content =
      typeof source === "string"
        ? { audio: { url: source }, mimetype: "audio/mp4", ptt }
        : { audio: source, mimetype: "audio/mp4", ptt };
    return await this.sock.sendMessage(
      jid,
      content,
      quoted ? { quoted } : {}
    );
  }

  /**
   * Kirim sticker
   */
  async sendSticker(jid, buffer, quoted = null) {
    return await this.sock.sendMessage(
      jid,
      { sticker: buffer },
      quoted ? { quoted } : {}
    );
  }

  /**
   * Kirim dokumen
   */
  async sendDocument(jid, buffer, filename, mimetype, quoted = null) {
    return await this.sock.sendMessage(
      jid,
      { document: buffer, filename, mimetype },
      quoted ? { quoted } : {}
    );
  }
}

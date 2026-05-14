import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
} from "@whiskeysockets/baileys";

import { createLogger, HabibiLogger } from "./logger.js";
import { MessageParser } from "./message.js";
import { MediaHelper } from "./media.js";

const MAX_RETRIES = 5;

/**
 * Habibi Socket — Wrapper utama koneksi WhatsApp
 */
export class HabibiSocket {
  constructor(options = {}) {
    this.options = {
      sessionDir: "./session",
      pairingNumber: null,
      usePairingCode: true,
      browser: ["Habibi Bot", "Chrome", "1.0.0"],
      syncFullHistory: false,
      ...options,
    };

    this.sock = null;
    this.retryCount = 0;
    this.callbacks = {};
    this.media = null;
  }

  /**
   * Daftarkan callback event
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    this.callbacks[event] = handler;
    return this;
  }

  /**
   * Mulai koneksi ke WhatsApp
   */
  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState(
      this.options.sessionDir
    );
    const { version } = await fetchLatestBaileysVersion();

    HabibiLogger.info("habibi", `WhatsApp versi: ${version.join(".")}`);

    this.sock = makeWASocket({
      version,
      logger: createLogger(true),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, createLogger(true)),
      },
      printQRInTerminal: !this.options.usePairingCode,
      browser: this.options.browser,
      syncFullHistory: this.options.syncFullHistory,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: false,
      getMessage: async () => undefined,
    });

    this.media = new MediaHelper(this.sock);

    this.sock.ev.on("creds.update", saveCreds);
    this._setupEvents();

    if (
      this.options.usePairingCode &&
      this.options.pairingNumber &&
      !this.sock.authState.creds.registered
    ) {
      await new Promise((r) => setTimeout(r, 3000));
      const number = this.options.pairingNumber.replace(/[^0-9]/g, "");
      try {
        const code = await this.sock.requestPairingCode(number);
        HabibiLogger.system("pairing", `Kode pairing: ${chalk_bold(code)}`);
        HabibiLogger.system("pairing", "Buka WA → Perangkat Tertaut → Tautkan Perangkat → Masukkan Nomor");
      } catch (e) {
        HabibiLogger.error("pairing", `Gagal minta kode: ${e.message}`);
        HabibiLogger.warn("pairing", "Pastikan nomor sudah benar di config.js (format: 628xxx)");
      }
    }

    return this;
  }

  _setupEvents() {
    this.sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        this.retryCount = 0;
        HabibiLogger.success(
          "koneksi",
          `Terhubung sebagai ${this.sock.user?.name || "Bot"}`
        );
        if (this.callbacks.open) {
          await this.callbacks.open(this.sock);
        }
      }

      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = code !== DisconnectReason.loggedOut;

        HabibiLogger.warn("koneksi", `Terputus (${code})`);

        if (shouldReconnect && this.retryCount < MAX_RETRIES) {
          this.retryCount++;
          const delay = Math.min(1000 * 2 ** this.retryCount, 30000);
          HabibiLogger.info(
            "koneksi",
            `Reconnect ke-${this.retryCount} dalam ${delay / 1000}s...`
          );
          setTimeout(() => this.connect(), delay);
        } else {
          HabibiLogger.error("koneksi", "Sesi logout. Hapus folder /session dan jalankan ulang.");
        }
      }
    });

    this.sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      for (const raw of messages) {
        if (!raw.message) continue;
        if (isJidBroadcast(raw.key.remoteJid)) continue;

        const parsed = new MessageParser(raw);

        try {
          if (this.callbacks.message) {
            await this.callbacks.message(parsed, this.sock);
          }
        } catch (err) {
          HabibiLogger.error("event", err.message);
        }
      }
    });

    this.sock.ev.on("group-participants.update", async (update) => {
      try {
        if (this.callbacks.groupUpdate) {
          await this.callbacks.groupUpdate(update, this.sock);
        }
      } catch (err) {
        HabibiLogger.error("group", err.message);
      }
    });
  }

  /** Kirim pesan teks */
  async sendText(jid, text, quoted = null) {
    return await this.sock.sendMessage(
      jid,
      { text },
      quoted ? { quoted } : {}
    );
  }

  /** React ke pesan */
  async react(jid, key, emoji) {
    return await this.sock.sendMessage(jid, {
      react: { text: emoji, key },
    });
  }

  /** Akses sock Baileys langsung */
  getRawSocket() {
    return this.sock;
  }
}

function chalk_bold(text) {
  return `\x1b[1m${text}\x1b[0m`;
}

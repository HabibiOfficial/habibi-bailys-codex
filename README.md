# habibi-baileys

> **WhatsApp Multi-Device Library** by HabibiOfficial  
> Powered by @whiskeysockets/baileys v7.0.0-rc11

---

## Tentang

**habibi-baileys** adalah library WhatsApp Multi-Device untuk Node.js yang memudahkan pembuatan bot WhatsApp. Library ini menyediakan API yang bersih dan mudah digunakan untuk berinteraksi dengan WhatsApp.

---

## Instalasi

```bash
npm install habibi-baileys
```

**Requirements:**
- Node.js >= 22.0.0

---

## Fitur

| Fitur | Deskripsi |
|---|---|
| `HabibiSocket` | Koneksi ke WhatsApp (Pairing Code / QR) |
| `MessageParser` | Parse pesan otomatis (teks, media, quoted, mention) |
| `MediaHelper` | Download & kirim gambar, video, audio, sticker, dokumen |
| `HabibiLogger` | Logger berwarna untuk terminal |

---

## Quick Start

```js
import { HabibiSocket, HabibiLogger } from "habibi-baileys";

const bot = new HabibiSocket({
  sessionDir: "./session",
  pairingNumber: "628xxxxxxxxx", // nomor WA kamu
  usePairingCode: true,          // true = pairing code, false = QR
});

bot
  .on("open", (sock) => {
    HabibiLogger.success("bot", "Terhubung ke WhatsApp!");
  })
  .on("message", async (parsed, sock) => {
    if (parsed.text === "ping") {
      await sock.sendMessage(parsed.from, { text: "🏓 Pong!" });
    }
  });

await bot.connect();
```

---

## API Reference

### `HabibiSocket`

Kelas utama untuk koneksi ke WhatsApp.

```js
const bot = new HabibiSocket(options);
```

**Options:**

| Parameter | Tipe | Default | Deskripsi |
|---|---|---|---|
| `sessionDir` | string | `./session` | Folder penyimpanan sesi |
| `pairingNumber` | string | null | Nomor WA (format: 628xxx) |
| `usePairingCode` | boolean | true | true = Pairing code, false = QR |
| `browser` | array | `["Habibi Bot", "Chrome", "1.0.0"]` | Identitas browser |
| `syncFullHistory` | boolean | false | Sync riwayat pesan |

**Events:**

```js
bot.on("open", (sock) => {})        // Bot berhasil konek
bot.on("message", (parsed, sock) => {})   // Pesan masuk
bot.on("groupUpdate", (update, sock) => {}) // Update grup
```

**Methods:**

```js
await bot.connect()              // Mulai koneksi
await bot.sendText(jid, text)    // Kirim teks
await bot.react(jid, key, emoji) // React ke pesan
bot.getRawSocket()               // Akses Baileys socket langsung
```

---

### `MessageParser`

Parse pesan WhatsApp dengan mudah.

```js
bot.on("message", async (parsed, sock) => {
  console.log(parsed.from)        // JID chat
  console.log(parsed.sender)      // JID pengirim
  console.log(parsed.pushName)    // Nama pengirim
  console.log(parsed.text)        // Isi teks
  console.log(parsed.isGroup)     // true jika dari grup
  console.log(parsed.hasMedia)    // true jika ada media
  console.log(parsed.mediaType)   // "image"/"video"/"audio"/"document"
  console.log(parsed.quoted)      // Pesan yang di-quote
  console.log(parsed.mentionedJids) // Array JID yang di-mention
  console.log(parsed.fromMe)      // true jika pesan dari bot sendiri
  console.log(parsed.timestamp)   // Unix timestamp (ms)
});
```

---

### `MediaHelper`

Download dan kirim berbagai jenis media.

```js
import { MediaHelper } from "habibi-baileys";

const media = new MediaHelper(sock);

// Download media dari pesan ke Buffer
const buffer = await media.download(msg);

// Kirim gambar
await media.sendImage(jid, "https://url.com/image.jpg", "Caption");
await media.sendImage(jid, buffer, "Caption");

// Kirim video
await media.sendVideo(jid, "https://url.com/video.mp4", "Caption");

// Kirim audio
await media.sendAudio(jid, buffer, false); // false = audio biasa, true = voice note

// Kirim sticker
await media.sendSticker(jid, buffer);

// Kirim dokumen
await media.sendDocument(jid, buffer, "file.pdf", "application/pdf");
```

---

### `HabibiLogger`

Logger berwarna untuk terminal.

```js
import { HabibiLogger } from "habibi-baileys";

HabibiLogger.info("tag", "pesan info")       // Cyan
HabibiLogger.success("tag", "berhasil")      // Hijau
HabibiLogger.warn("tag", "peringatan")       // Kuning
HabibiLogger.error("tag", "error")           // Merah
HabibiLogger.system("tag", "sistem")         // Magenta
HabibiLogger.banner()                         // Banner HABIBI BAILEYS
HabibiLogger.divider()                        // Garis pemisah
```

---

## Contoh Bot Lengkap

```js
import path from "path";
import { HabibiSocket, HabibiLogger, MediaHelper } from "habibi-baileys";

const bot = new HabibiSocket({
  sessionDir: "./session",
  pairingNumber: "628xxxxxxxxx",
  usePairingCode: true,
});

const PREFIX = ".";

bot
  .on("open", async (sock) => {
    HabibiLogger.banner();
    HabibiLogger.success("bot", "Bot siap!");
  })
  .on("message", async (parsed, sock) => {
    const { from, text, isGroup, sender, hasMedia } = parsed;
    if (!text.startsWith(PREFIX)) return;

    const cmd = text.slice(PREFIX.length).trim().split(" ")[0].toLowerCase();
    const media = new MediaHelper(sock);

    switch (cmd) {
      case "ping":
        await sock.sendMessage(from, { text: "🏓 Pong!" });
        break;

      case "sticker":
        if (!hasMedia) {
          await sock.sendMessage(from, { text: "❌ Balas gambar/video!" });
          break;
        }
        const buffer = await media.download(parsed.msg);
        await media.sendSticker(from, buffer);
        break;

      default:
        break;
    }
  });

await bot.connect();
```

---

## Changelog

### v1.0.0
- Rilis pertama habibi-baileys
- `HabibiSocket` — koneksi WA dengan auto-reconnect
- `MessageParser` — parsing pesan lengkap
- `MediaHelper` — download & kirim semua jenis media
- `HabibiLogger` — logger berwarna
- Support Baileys v7.0.0-rc11

---

## Author

**HabibiOfficial**  
GitHub: [github.com/HabibiOfficial](https://github.com/HabibiOfficial)

## License

MIT

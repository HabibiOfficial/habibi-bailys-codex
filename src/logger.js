import chalk from "chalk";
import pino from "pino";

/**
 * Buat logger untuk Habibi Baileys
 * @param {boolean} silent - Sembunyikan log internal Baileys
 */
export function createLogger(silent = true) {
  return pino({ level: silent ? "silent" : "debug" });
}

const pad = (str, len = 10) => str.padEnd(len);

/**
 * Logger berwarna untuk console
 */
export const HabibiLogger = {
  info: (tag, msg) =>
    console.log(
      `${chalk.cyan("[")}${chalk.bold.cyan(pad(tag))}${chalk.cyan("]")} ${chalk.white(msg)}`
    ),

  success: (tag, msg) =>
    console.log(
      `${chalk.green("[")}${chalk.bold.green(pad(tag))}${chalk.green("]")} ${chalk.greenBright(msg)}`
    ),

  warn: (tag, msg) =>
    console.log(
      `${chalk.yellow("[")}${chalk.bold.yellow(pad(tag))}${chalk.yellow("]")} ${chalk.yellowBright(msg)}`
    ),

  error: (tag, msg) =>
    console.log(
      `${chalk.red("[")}${chalk.bold.red(pad(tag))}${chalk.red("]")} ${chalk.redBright(msg)}`
    ),

  system: (tag, msg) =>
    console.log(
      `${chalk.magenta("[")}${chalk.bold.magenta(pad(tag))}${chalk.magenta("]")} ${chalk.magentaBright(msg)}`
    ),

  banner: () => {
    console.log(chalk.cyan("╔════════════════════════════════╗"));
    console.log(chalk.cyan("║") + chalk.bold.white("   🤖  HABIBI BAILEYS v1.0.0    ") + chalk.cyan("║"));
    console.log(chalk.cyan("║") + chalk.gray("   by HabibiOfficial              ") + chalk.cyan("║"));
    console.log(chalk.cyan("╚════════════════════════════════╝"));
  },

  divider: () => console.log(chalk.gray("─".repeat(40))),
};

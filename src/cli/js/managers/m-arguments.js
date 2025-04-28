import { execSync } from "child_process";

export default class ArgumentsManager {
  static CHECK() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.error("No arguments provided. Use --help for usage information.");
      return;
    }

    const argm = {
      "--help": this.HELP,
      "--version": this.VERSION
    };

    const handler = argm[args[0]];
    if (handler) {
      handler(args.slice());
    } else {
      console.error(`Unknown option: ${args[0]}`);
      process.exit(1);
    }

    return args;
  }

  static HELP(params) {
    try {
      execSync("man ./man/man.1", { stdio: "inherit" });
    } catch (err) {
      console.error("Error displaying man page:", err.message);
    }
    process.exit(0);
  }

  static VERSION(params) {
    console.log(`Erebus CLI v${pkg.version}`);
    process.exit(0);
  }
}

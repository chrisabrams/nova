import { Command, EnumType } from "cliffy/command/mod.ts";
import commandDev from "./commands/dev.ts";

const logLevelType = new EnumType(["debug", "info", "warn", "error"]);

await new Command()
  .name("nova")
  .version("0.1.0")
  .description("Command line for Nova.")
  .type("log-level", logLevelType)
  .env("DEBUG=<enable:boolean>", "Enable debug output.")
  .option("-d, --debug", "Enable debug output.")
  .option("-l, --log-level <level:log-level>", "Set log level.", {
    default: "info" as const,
  })
  .command("dev", commandDev)
  .parse(Deno.args);

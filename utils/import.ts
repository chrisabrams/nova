import { readFileSync } from "std/node/fs.ts";
import NovaConfig from "nova/core/config/index.ts";

export async function generatePath(path: string) {
  const config = await NovaConfig.getAppConfig();

  if (!config) {
    throw new Error("No config found when generating path.");
  }

  const dev = config.mode === "development";

  return dev ? `${path}#${Date.now()}` : path; // #Date.now() is a hack to force Deno to re-import the file
}

export async function importer(path: string) {
  const importPath = await generatePath(path);

  return import(importPath);
}

/**
 * The intent of this method is to provide cache-busting of text files
 * while in development mode. Unfortunately, Deno.readTextFile() does
 * not support cache-busting. There is no known solution to this problem
 * at this time. As a result, Node.js's readFileSync method is used
 * instead.
 *
 * @param path
 * @see https://github.com/denoland/deno/issues/5548
 */
export async function readTextFile(path: string) {
  // const importPath = await generatePath(path);

  // return Deno.readTextFile(path);
  return readFileSync(path, { encoding: "utf8" });
}

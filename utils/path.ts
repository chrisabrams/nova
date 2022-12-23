import * as path from "std/path/mod.ts";

export function getDirname(url: string) {
  return path.dirname(path.fromFileUrl(url));
}

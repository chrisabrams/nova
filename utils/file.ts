import { join } from "std/path/mod.ts";
import NovaConfig from "../core/config/index.ts";

/**
 * Does a file exist?
 */
export async function fileExists(path: string) {
  try {
    (await Deno.stat(path)).size;

    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    }

    return false;
  }
}

export async function getAppFilepath(filepath: string) {
  const appPath = await getAppPath();
  const distPath = await getDistPath();
  const resultPath = filepath.replace(distPath, appPath);

  return resultPath;
}

export async function getAppPath() {
  const appConfig = await NovaConfig.getAppConfig(); // In the future this could be configured.
  const cwd = Deno.cwd();
  const appPath = join(cwd, "app");

  return appPath;
}

/**
 * Get the path to a file in the dist directory. Converts the filepath
 * when MDX files are considered.
 * @param filepath
 * @param param1
 * @returns
 */
export async function getDistFilepath(
  filepath: string,
  { mdx = undefined }: { mdx?: "compiled" | "transformed" } = {}
) {
  const appPath = await getAppPath();
  const distPath = await getDistPath();
  const resultPath = filepath.replace(appPath, distPath);

  return resultPath.endsWith(".mdx") && mdx
    ? mdx == "compiled"
      ? resultPath.replace(/\.mdx$/, ".js")
      : resultPath.replace(/\.mdx$/, ".mdx.tsx")
    : resultPath;
}

export async function getDistPath() {
  const appConfig = await NovaConfig.getAppConfig();
  const cwd = Deno.cwd();
  const distPath = join(cwd, appConfig?.distDir || "dist");

  return distPath;
}

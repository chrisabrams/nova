import { fileExists } from "nova/utils/file.ts";
import { join } from "std/path/mod.ts";
import { DenoConfig, ImportMap } from "./types.ts";

class NovaConfig {
  /**
   * Get the configuration for the Deno runtime.
   */
  static async getDenoConfig(): Promise<DenoConfig | null> {
    const cwd = Deno.cwd();
    let denoConfigPath = join(cwd, "deno.json");

    if (!(await fileExists(denoConfigPath))) {
      denoConfigPath = join(cwd, "deno.jsonc");
    }

    if (!(await fileExists(denoConfigPath))) {
      return null;
    }

    // return JSON.parse(Deno.readTextFileSync(denoConfigPath));
    try {
      const config = await import(denoConfigPath, {
        assert: { type: "json" },
      });

      return config.default as DenoConfig;
    } catch (e) {
      console.error("Error parsing deno.json", e);

      return null;
    }
  }

  /**
   * Get the import map for the Deno runtime.
   */
  static async getImportMap() {
    const cwd = Deno.cwd();
    let importMapPath = join(cwd, "import-map.json");

    if (!(await fileExists(importMapPath))) {
      const denoConfig = await NovaConfig.getDenoConfig();

      if (denoConfig?.importMap) {
        importMapPath = join(cwd, denoConfig.importMap);
      }
    }

    if (!(await fileExists(importMapPath))) {
      return null;
    }

    try {
      const importMap = await import(importMapPath, {
        assert: { type: "json" },
      });

      return importMap.default as ImportMap;
    } catch (e) {
      console.error("Error parsing import-map.json", e);

      return null;
    }
  }
}

export default NovaConfig;

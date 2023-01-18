import type { NovaAppConfig } from "nova/core/config/types.ts";

const config: NovaAppConfig = {
  extensions: ["nova/ext/pages/index.ts"],
  mode: "development",
};

export default config;

import NovaConfig from "nova/core/config/index.ts";
import NovaExtension from "nova/extensions/v0.ts";
import type { NovaBootstrapExtensionsProps } from "./types.ts";

async function bootstrapExtensions({ server }: NovaBootstrapExtensionsProps) {
  const config = await NovaConfig.getAppConfig();

  if (config) {
    const extensionList = config.extensions || [];

    for (let i = 0, l = extensionList.length; i < l; i++) {
      const extensionPath = extensionList[i];

      try {
        const extensionModule = await import(extensionPath);

        if (extensionModule.default) {
          const extension: NovaExtension = extensionModule.default;

          for (let j = 0, k = extension.actions.length; j < k; j++) {
            const { action, type } = extension.actions[j];

            switch (type) {
              case "server":
                await action({ server });

                break;
            }
          }
        }
      } catch (e) {
        console.error("Error loading extension:", extensionPath, "\n", e);
      }
    }
  }
}

export default bootstrapExtensions;

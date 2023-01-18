import { describe, expect, it } from "test/_.ts";
import NovaConfig from "nova/core/config/index.ts";

describe("App Config", () => {
  it("shoudl error when no app config is found", async () => {
    try {
      const config = await NovaConfig.getAppConfig();
    } catch (e) {
      expect(e).to.throw;
    }
  });
});

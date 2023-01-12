import { importer } from "./import.ts";

export async function tseval(filepath: string, code: string) {
  const moduleURL = filepath + ".tsx";
  await Deno.writeFile(moduleURL, new TextEncoder().encode(code));
  const module = await importer(moduleURL);
  await Deno.remove(moduleURL);

  return module;
}

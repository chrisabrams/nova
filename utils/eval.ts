import { getAppPath, getDistFilepath } from "./file.ts";
import { importer } from "./import.ts";

export async function tseval(
  filepath: string,
  code: string,
  { imports = "app" }: { imports?: "app" | "dist" } = {}
) {
  /*const moduleURL =
    imports == "dist"
      ? await getDistFilepath(filepath, { mdx: "transformed" })
      : filepath;*/
  // const cwd = Deno.cwd();
  const isMDXFile = filepath.endsWith(".mdx");
  const moduleURL = isMDXFile
    ? await await getDistFilepath(filepath, { mdx: "transformed" })
    : filepath;
  let dir = "";

  try {
    dir = moduleURL.replace(/\/[^\/]+$/, "");
    await Deno.mkdir(dir, { recursive: true });
  } catch (e) {
    console.error("Could not create directory for module:");
    console.error("Module URL:", moduleURL);
    console.error("Directory:", dir);

    throw new Error(e);
  }
  // console.log("moduleURL", moduleURL);
  await Deno.writeFile(
    moduleURL,
    new TextEncoder().encode(
      isMDXFile ? code.replace("./", (await getAppPath()) + "/") : code
    )
  );
  const module = await importer(moduleURL);
  // await Deno.remove(moduleURL);

  return module;
}

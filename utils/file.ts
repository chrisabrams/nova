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

/**
 *
 * @param object
 * @param key
 * @returns
 * @see https://github.com/microsoft/TypeScript/issues/1863#issuecomment-689028589
 */
export function getFromIndex<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

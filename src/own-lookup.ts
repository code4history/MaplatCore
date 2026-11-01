/** 外から来た鍵でレコードを引く。自分の鍵（Object.hasOwn）だけを返し、継承した鍵は返さない。 */
export function ownEntry<T>(record: unknown, key: unknown): T | undefined {
  if (record === null || typeof record !== "object") return undefined;
  if (typeof key !== "string") return undefined;
  return Object.hasOwn(record, key) ? (record as Record<string, T>)[key] : undefined;
}

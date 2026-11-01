/** 外から来た鍵でレコードを引く。自分の鍵（Object.hasOwn）だけを返し、継承した鍵は返さない。 */
export declare function ownEntry<T>(record: unknown, key: unknown): T | undefined;

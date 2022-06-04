type AllLoggerLevelKeys = "ALL" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF";
const excludeKeys = ["ALL", "OFF"] as const;
type LoggerLevelKeys = Exclude<AllLoggerLevelKeys, typeof excludeKeys[number]>;
type TLogger = { [key in Lowercase<LoggerLevelKeys>]: Console["log"] };

export const LOGGER_LEVEL = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
} as const;

// eslint-disable-next-line
export interface Logger extends TLogger {}

export class Logger {
  constructor(
    public level: typeof LOGGER_LEVEL[AllLoggerLevelKeys] = LOGGER_LEVEL.INFO
  ) {
    this.make();
  }

  private make() {
    const keys = (Object.keys(LOGGER_LEVEL) as AllLoggerLevelKeys[]).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      key => !excludeKeys.includes(key)
    ) as LoggerLevelKeys[];

    for (const key of keys) {
      const l = LOGGER_LEVEL[key];
      const lowerCaseKey = key.toLowerCase() as Lowercase<LoggerLevelKeys>;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this[lowerCaseKey] = this.level <= l ? console.log : () => {};
    }
  }
}

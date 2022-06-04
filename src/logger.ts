type LoggerLevelKeys = "ALL" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF";

export const LOGGER_LEVEL: Record<LoggerLevelKeys, number> = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
} as const;

type TLogger = { [key in Lowercase<LoggerLevelKeys>]: Console["log"] };
// eslint-disable-next-line
export interface Logger extends TLogger {}

export class Logger {
  constructor(
    public level: typeof LOGGER_LEVEL[LoggerLevelKeys] = LOGGER_LEVEL.INFO
  ) {
    this.make();
  }

  private make() {
    for (const key of Object.keys(LOGGER_LEVEL) as Array<LoggerLevelKeys>) {
      const l = LOGGER_LEVEL[key];
      const lowerCaseKey = key.toLowerCase() as Lowercase<LoggerLevelKeys>;

      if (this.level <= l) {
        this[lowerCaseKey] = console.log;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this[lowerCaseKey] = () => {};
      }
    }
  }
}

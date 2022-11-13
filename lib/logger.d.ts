declare type AllLoggerLevelKeys = "ALL" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF";
declare const excludeKeys: readonly ["ALL", "OFF"];
declare type LoggerLevelKeys = Exclude<AllLoggerLevelKeys, typeof excludeKeys[number]>;
declare type TLogger = {
    [key in Lowercase<LoggerLevelKeys>]: Console["log"];
};
export declare const LOGGER_LEVEL: {
    readonly ALL: -99;
    readonly DEBUG: -1;
    readonly INFO: 0;
    readonly WARN: 1;
    readonly ERROR: 2;
    readonly OFF: 99;
};
export interface Logger extends TLogger {
}
export declare class Logger {
    level: typeof LOGGER_LEVEL[AllLoggerLevelKeys];
    constructor(level?: typeof LOGGER_LEVEL[AllLoggerLevelKeys]);
    private make;
}
export {};

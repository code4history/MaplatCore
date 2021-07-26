export declare const LoggerLevel: {
    readonly ALL: -99;
    readonly DEBUG: -1;
    readonly INFO: 0;
    readonly WARN: 1;
    readonly ERROR: 2;
    readonly OFF: 99;
};
export declare class Logger {
    level: number;
    constructor(level: any);
    make(): void;
}

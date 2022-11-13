const excludeKeys = ["ALL", "OFF"];
export const LOGGER_LEVEL = {
    ALL: -99,
    DEBUG: -1,
    INFO: 0,
    WARN: 1,
    ERROR: 2,
    OFF: 99
};
export class Logger {
    constructor(level = LOGGER_LEVEL.INFO) {
        this.level = level;
        this.make();
    }
    make() {
        const keys = Object.keys(LOGGER_LEVEL).filter(key => !excludeKeys.includes(key));
        for (const key of keys) {
            const l = LOGGER_LEVEL[key];
            const lowerCaseKey = key.toLowerCase();
            this[lowerCaseKey] = this.level <= l ? console.log : () => { };
        }
    }
}
//# sourceMappingURL=logger.js.map
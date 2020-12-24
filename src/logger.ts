export const LoggerLevel = {
    ALL: -99,
    DEBUG: -1,
    INFO: 0,
    WARN: 1,
    ERROR: 2,
    OFF: 99
};
export class Logger {
    constructor(level: any) {
        const self = this;
        (self as any).level = isNaN(level) ? LoggerLevel.INFO : level;
        self.make();
    }
    make() {
        const self = this;
        for (const key in console) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const l = LoggerLevel[key.toUpperCase()];
            if (!l) {
                // l=LoggerLevel.OFF;
                continue;
            }
            if ((self as any).level <= l) {
                // @ts-expect-error ts-migrate(2774) FIXME: This condition will always return true since the f... Remove this comment to see the full error message
                if (Function.bind) {
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    Logger.prototype[key] = (function (..._args) {
                        return console.log.bind(console);
                    })(key);
                }
                else {
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    Logger.prototype[key] = (function (...args) {
                        return console.log(...args);
                    })(key);
                }
            }
            else {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                Logger.prototype[key] = function () { };
            }
        }
    }
}

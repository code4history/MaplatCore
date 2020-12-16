export const LoggerLevel = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};

export class Logger {
  constructor(level) {
    const self = this;
    self.level = isNaN(level) ? LoggerLevel.INFO : level;
    self.make();
  }

  make() {
    const self = this;
    for (const key in console) {
      // eslint-disable-line no-undef
      const l = LoggerLevel[key.toUpperCase()];
      if (!l) {
        // l=LoggerLevel.OFF;
        continue;
      }
      if (self.level <= l) {
        if (Function.bind) {
          Logger.prototype[key] = (function (...args) {
            // eslint-disable-line no-unused-vars
            return console.log.bind(console); // eslint-disable-line no-undef
          })(key);
        } else {
          Logger.prototype[key] = (function (...args) {
            return console.log(...args); // eslint-disable-line no-undef
          })(key);
        }
      } else {
        Logger.prototype[key] = function () {};
      }
    }
  }
}

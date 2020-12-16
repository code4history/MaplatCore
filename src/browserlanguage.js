const browserLanguage = function () {
  const ua = window.navigator.userAgent.toLowerCase(); // eslint-disable-line no-undef
  try {
    let lang;
    // Chrome
    if (ua.indexOf("chrome") != -1) {
      lang = (
        navigator.languages[0] ||
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).split(";"); // eslint-disable-line no-undef
      return lang[0];
    }
    // Other
    else {
      lang = (
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).split(";"); // eslint-disable-line no-undef
      return lang[0];
    }
  } catch (e) {
    return undefined;
  }
};

export default browserLanguage;

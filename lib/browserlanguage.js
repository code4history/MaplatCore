const browserLanguage = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    try {
        let lang;
        if (ua.indexOf("chrome") != -1) {
            lang = (navigator.languages[0] ||
                navigator.browserLanguage ||
                navigator.language ||
                navigator.userLanguage).split(";");
            return lang[0];
        }
        else {
            lang = (navigator.browserLanguage ||
                navigator.language ||
                navigator.userLanguage).split(";");
            return lang[0];
        }
    }
    catch (e) {
        return "";
    }
};
export default browserLanguage;
//# sourceMappingURL=browserlanguage.js.map
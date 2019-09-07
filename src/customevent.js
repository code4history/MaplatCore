const eventClass = (function() {
    if (typeof window.CustomEvent === "function") return window.CustomEvent; // eslint-disable-line no-undef

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined }
        const evt = document.createEvent("CustomEvent") // eslint-disable-line no-undef
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }

    CustomEvent.prototype = window.Event.prototype; // eslint-disable-line no-undef

    window.CustomEvent = CustomEvent; // eslint-disable-line no-undef
    return CustomEvent;
})();

export default eventClass;
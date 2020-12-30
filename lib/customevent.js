import Event from "ol/events/Event";
export default class CustomEvent extends Event {
    constructor(type, detail) {
        super(type);
        this.detail = detail;
    }
}
//# sourceMappingURL=customevent.js.map
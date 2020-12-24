import Event from "ol/events/Event";

export default class CustomEvent extends Event {
  detail: any;
  constructor(type: any, detail: any) {
    super(type);
    this.detail = detail;
  }
}

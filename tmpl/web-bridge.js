import { MaplatApp } from "../src";

// eslint-disable-next-line no-undef
const Maplat = window.Maplat = {};

// eslint-disable-next-line arrow-body-style
Maplat.createObject = (option) => {
  return new Promise(((resolve) => {
    const app = new MaplatApp(option);
    app.waitReady.then(() => {
      resolve(app);
    });
  }));
};

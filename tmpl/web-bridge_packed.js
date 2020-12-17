import { MaplatApp } from "../src/index_packed";

const Maplat = window.Maplat = {};

Maplat.createObject = option => new Promise((resolve => {
  const app = new MaplatApp(option);
  app.waitReady.then(() => {
    resolve(app);
  });
}));

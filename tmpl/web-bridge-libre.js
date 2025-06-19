import { MaplatAppLibre } from "../src/index_libre";
import "../less/core.less"
import 'maplibre-gl/dist/maplibre-gl.css';

const Maplat = window.Maplat = {};

Maplat.createObject = option => new Promise((resolve => {
  const app = new MaplatAppLibre(option);
  app.waitReady.then(() => {
    resolve(app);
  });
}));
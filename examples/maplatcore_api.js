import { MaplatApp } from "../src/index.ts";
import "../less/core.less";

(async () => {
  const option = {
    mapboxgl,
    mapboxToken: 'YOUR-ACCESS-TOKEN',
    northUp: true,
    tapDuration: 60000,
    homeMarginPixels: 100,
    tapUIVanish: true,
    div: "map",
  };

  const hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (let i = 0; i < hashes.length; i++) {
    const hash = hashes[i].split("=");
    option[hash[0]] =
      hash[1] == "true" ? true : hash[1] == "false" ? false : hash[1];
  }

  const app = new MaplatApp(option);
  await app.waitReady;
  console.log("####Message appReady");
  console.log(app);
  console.log(app.currentMapInfo());
  console.log(app.mapInfo("gsi"));
  let moveFlag = false;
  app.addEventListener("clickMarker", evt => {
    app.selectMarker(evt.detail.namespaceID);
    console.log(`####Message clickMarker ${JSON.stringify(evt.detail)}`);
  });
  app.addEventListener("clickMap", evt => console.log(`####Message clickMap ${JSON.stringify(evt.detail)}`));
  app.addLine({
    lnglats: [
      [141.151995, 39.701599],
      [141.151137, 39.703736],
      [141.1521671, 39.7090232]
    ],
    stroke: {
      color: "#ffcc33",
      width: 2
    }
  });
  app.addVector({
    type: "Line",
    lnglats: [
      [141.14791274070737, 39.69741334474737],
      [141.14660382270813, 39.69681897707071],
      [141.14725828170776, 39.69597694743377],
      [141.14853501319885, 39.69661259820805],
      [141.14900708198547, 39.696034734109695]
    ],
    style: {
      stroke: {
        color: "#ff0000",
        width: 2
      }
    }
  });
  app.addVector({
    type: "Polygon",
    lnglats: [[
      [141.15129232406616, 39.6978013319974],
      [141.14970445632935, 39.696967569469734],
      [141.15129232406616, 39.695877884448194],
      [141.15272998809814, 39.69686850790594],
      [141.15129232406616, 39.6978013319974]
    ], [
      [141.15143179893494, 39.697273008396415],
      [141.1508524417877, 39.69687676304167],
      [141.15146398544312, 39.69657957753276],
      [141.15143179893494, 39.697273008396415]
    ]],
    style: {
      stroke: {
        color: [0, 255, 0],
        width: 2
      },
      fill: {
        color: [0, 255, 0, 0.4]
      }
    }
  });
  app.addPoiLayer("main2");
  app.addPoiLayer("morioka_ndl2#main2", {
    icon: "parts_test/blue_marker.png",
    selectedIcon: "parts_test/red_marker.png"
  });
  document.getElementById("show").addEventListener("click", () => app.showPoiLayer("main"));
  document.getElementById("hide").addEventListener("click", () => app.hidePoiLayer("main"));
  document.getElementById("clear").addEventListener("click", () => app.clearMarker("main"));
  document.getElementById("move").addEventListener("click", () => {
    let data;
    if (moveFlag) {
      data = { lnglat: [141.145358, 39.69862] };
    } else {
      data = { lnglat: [141.146534, 39.694758] };
    }
    moveFlag = !moveFlag;
    app.updateMarker("main_1", data);
  });
  document.getElementById("remove").addEventListener("click", () => app.removeMarker("main_2"));
  document.getElementById("add2").addEventListener("click", () => app.addMarker({
    address: "岩手県盛岡市内丸1-42",
    desc: "寛延２年創建で当時の藩主南部利視が初代藩主南部信直の功績を称え社殿を建立し御霊を勧請したのが始まりとされている。",
    icon: undefined,
    image: "sakurayama_jinja.jpg",
    lnglat: [141.151995, 39.701599],
    name: "桜山神社",
    selectedIcon: undefined,
    start: 1749
  }, "main2"));
  document.getElementById("clear2").addEventListener("click", () => app.clearMarker("main2"));
  document.getElementById("addMap").addEventListener("click", () => app.addMarker({
    address: "岩手県盛岡市内丸1-37",
    desc: "南部（盛岡）藩南部氏の居城である。西部を流れる北上川と南東部を流れる中津川の合流地、現在の盛岡市中心部にあった花崗岩丘陵に築城された連郭式平山城。",
    icon: undefined,
    image: "moriokajo.jpg",
    lnglat: [141.1501111, 39.69994722],
    name: { ja: "盛岡城", en: "Morioka Castle" },
    selectedIcon: undefined,
    start: 1598
  }, "morioka_ndl2#main2"));
  document.getElementById("clearMap").addEventListener("click", () => app.clearMarker("morioka_ndl2#all"));
  document.getElementById("unSelect").addEventListener("click", () => app.unselectMarker());
  document.getElementById("showAll").addEventListener("click", () => app.showAllMarkers());
  document.getElementById("hideAll").addEventListener("click", () => app.hideAllMarkers());
  document.getElementById("morioka").addEventListener("click", () => app.changeMap("morioka"));
  document.getElementById("maplat").addEventListener("click", () => app.changeMap("morioka_ndl2"));
  document.getElementById("tms").addEventListener("click", () => app.changeMap("morioka_ndl_affine"));
  document.getElementById("osm").addEventListener("click", () => app.changeMap("osm"));
  document.getElementById("gsi").addEventListener("click", () => app.changeMap("gsi"));
  document.getElementById("mapbox").addEventListener("click", () => app.changeMap("mapbox"));
  document.getElementById("go_home").addEventListener("click", () => app.goHome());
  document.getElementById("reset_rotation").addEventListener("click", () => app.resetRotation());
  document.getElementById("reset_direction").addEventListener("click", () => app.resetDirection());
  document.getElementById("reset_circulation").addEventListener("click", () => app.resetCirculation());
  document.getElementById("map_remove").addEventListener("click", () => app.remove());
})();
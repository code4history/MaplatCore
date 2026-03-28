import { MaplatApp } from '../src/index.ts';

window.addEventListener('DOMContentLoaded', async () => {
  var option: any = {
    appid: "test"
  };
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    var hash = hashes[i].split("=");
    option[hash[0]] =
      hash[1] == "true" ? true : hash[1] == "false" ? false : hash[1];
  }

  // For backward compatibility
  (window as any).Maplat = MaplatApp;

  MaplatApp.createObject(option).then(function (app: any) {
    console.log(app);
    console.log(app.currentMapInfo());
    console.log(app.mapInfo("gsi"));
    var moveFlag = false;
    app.addEventListener("clickMarker", function (evt: any) {
      app.selectMarker(evt.detail.namespaceID);
      console.log(evt);
    });
    app.addEventListener("clickMap", function (evt: any) {
      console.log(evt);
    });
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
    app.addPoiLayer("main2");
    app.addPoiLayer("morioka_ndl2#main2", {
      icon: "parts_test/blue_marker.png",
      selectedIcon: "parts_test/red_marker.png"
    });
    document.getElementById("show")!.addEventListener("click", function () {
      app.showPoiLayer("main");
    });
    document.getElementById("hide")!.addEventListener("click", function () {
      app.hidePoiLayer("main");
    });
    document.getElementById("clear")!.addEventListener("click", function () {
      app.clearMarker("main");
    });
    document.getElementById("move")!.addEventListener("click", function () {
      var data;
      if (moveFlag) {
        data = { lnglat: [141.145358, 39.69862] };
      } else {
        data = { lnglat: [141.146534, 39.694758] };
      }
      moveFlag = !moveFlag;
      app.updateMarker("main_1", data);
    });
    document.getElementById("remove")!.addEventListener("click", function () {
      app.removeMarker("main_2");
    });
    document.getElementById("add2")!.addEventListener("click", function () {
      app.addMarker(
        {
          address: "岩手県盛岡市内丸1-42",
          desc: "寛延２年創建で当時の藩主南部利視が初代藩主南部信直の功績を称え社殿を建立し御霊を勧請したのが始まりとされている。",
          icon: undefined,
          image: "sakurayama_jinja.jpg",
          lnglat: [141.151995, 39.701599],
          name: "桜山神社",
          selectedIcon: undefined,
          start: 1749
        },
        "main2"
      );
    });
    document.getElementById("clear2")!.addEventListener("click", function () {
      app.clearMarker("main2");
    });
    document.getElementById("addMap")!.addEventListener("click", function () {
      app.addMarker(
        {
          address: "岩手県盛岡市内丸1-37",
          desc: "南部（盛岡）藩南部氏の居城である。西部を流れる北上川と南東部を流れる中津川の合流地、現在の盛岡市中心部にあった花崗岩丘陵に築城された連郭式平山城。",
          icon: undefined,
          image: "moriokajo.jpg",
          lnglat: [141.1501111, 39.69994722],
          name: { ja: "盛岡城", en: "Morioka Castle" },
          selectedIcon: undefined,
          start: 1598
        },
        "morioka_ndl2#main2"
      );
    });
    document.getElementById("clearMap")!.addEventListener("click", function () {
      app.clearMarker("morioka_ndl2#all");
    });
    document.getElementById("unSelect")!.addEventListener("click", function () {
      app.unselectMarker();
    });
    document.getElementById("showAll")!.addEventListener("click", function () {
      app.showAllMarkers();
    });
    document.getElementById("hideAll")!.addEventListener("click", function () {
      app.hideAllMarkers();
    });
    document.getElementById("morioka")!.addEventListener("click", function () {
      app.changeMap("morioka");
    });
    document.getElementById("maplat")!.addEventListener("click", function () {
      app.changeMap("morioka_ndl2");
    });
    document.getElementById("tms")!.addEventListener("click", function () {
      app.changeMap("morioka_ndl_affine");
    });
    document.getElementById("osm")!.addEventListener("click", function () {
      app.changeMap("osm");
    });
    document.getElementById("gsi")!.addEventListener("click", function () {
      app.changeMap("gsi");
    });
    document.getElementById("mapbox")!.addEventListener("click", function () {
      app.changeMap("mapbox");
    });
    document.getElementById("map_remove")!.addEventListener("click", function () {
      app.remove();
    });
  });
});

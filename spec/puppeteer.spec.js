/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const sleep = require("sleep-promise");

describe("Puppeteer test", () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("http://localhost:8888/test.html", { timeout: 100000 });
  }, 100000);

  it("Click and check latlong", async done => {
    let status = 0;
    page.on("console", async msg => {
      const result = msg.text().match(/^####Message (\w+)(?: (.+))?$/);
      //console.log(result);
      if (result) {
        const type = result[1];
        const json = result[2] ? treeWalk(JSON.parse(result[2]), 5) : undefined;
        switch (type) {
          case "appReady":
            await sleep(2000);
            await page.mouse.click(132, 103, { button: "left" });
            break;
          case "clickMarker":
            expect(json.name).toMatch("盛岡銀行本店本館");
            expect(json.address).toMatch("岩手県盛岡市中ノ橋通1-2-20");
            expect(json.desc).toMatch(
              "明治期に岩手県盛岡で設立された銀行。1896年盛岡の財界人の尽力により、商業銀行として創設された。"
            );
            expect(json.image).toMatch("moriokaginko.jpg");
            expect(`${json.start}`).toMatch("1896");
            expect(`${json.lnglat[0]}`).toMatch("141.15296");
            expect(`${json.lnglat[1]}`).toMatch("39.7006");
            expect(json.id).toMatch("main_1");
            expect(json.namespaceID).toMatch("main_1");
            done();
            break;
          case "clickMap":
            switch (status) {
              case 0:
                expect(`${json.longitude}`).toMatch("141.04905");
                expect(`${json.latitude}`).toMatch("39.74577");
                status = 1;
                await page.mouse.down();
                await sleep(3000);
                await page.mouse.move(0, 0);
                await page.mouse.move(132, 103);
                await page.mouse.down();
                await sleep(1000);
                await page.mouse.move(250, 250);
                await sleep(1000);
                await page.mouse.up();
                await sleep(2000);
                await page.mouse.click(132, 103, { button: "left" });
                console.log("clicked!!");
                break;
              case 1:
                expect(`${json.longitude}`).toMatch("141.0316");
                expect(`${json.latitude}`).toMatch("39.7613");
                status = 2;
                await page.evaluate(() => {
                  const element = document.getElementById("morioka");
                  element.click();
                });
                await sleep(3000);
                await page.mouse.click(132, 103, { button: "left" });
                break;
              case 2:
                expect(`${json.longitude}`).toMatch("141.16322");
                expect(`${json.latitude}`).toMatch("39.70777");
                //await page.screenshot({ path: 'screenshot.png' });
                await page.mouse.click(645, 277, { button: "left" });
                break;
            }
        }
      }
    });
  }, 120000);
});

function treeWalk(obj, depth) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(key => (obj[key] = treeWalk(obj[key], depth)));
  } else if (typeof obj === "number" && !`${obj}`.match(/^\d+$/)) {
    obj = Math.round(obj * Math.pow(10, depth)) / Math.pow(10, depth);
  }
  return obj;
}

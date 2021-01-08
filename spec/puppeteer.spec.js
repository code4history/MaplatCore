/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const sleep = require("sleep-promise");

describe("Puppeteer test", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8888/index.html", { timeout: 100000 });
  }, 100000);

  it("Click and check latlong", async done => {
    let status = 0;
    page.on("console", async msg => {
      const result = msg.text().match(/^####Message (\w+)(?: (.+))?$/);
      if (result) {
        const type = result[1];
        const json = result[2] ? treeWalk(JSON.parse(result[2]), 5) : undefined;
        switch (type) {
          case "appReady":
            await sleep(2000);
            await page.mouse.click(132, 103, { button: "left" });
            break;
          case "clickMap":
            if (status === 0) {
              expect(`${json.longitude}`).toMatch("141.10398");
              expect(`${json.latitude}`).toMatch("39.72597");
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
            } else if (status === 1) {
              expect(`${json.longitude}`).toMatch("141.08653");
              expect(`${json.latitude}`).toMatch("39.7415");
              done();
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

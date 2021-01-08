/* eslint-disable no-undef */
describe("Puppeteer test", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8888/index.html", { timeout: 100000 });
  }, 100000);

  it("Click and check latlong", async done => {
    page.on("console", async msg => {
      const result = msg.text().match(/^####Message (\w+)(?: (.+))?$/);
      if (result) {
        const type = result[1];
        const json = result[2] ? treeWalk(JSON.parse(result[2]), 5) : undefined;
        switch (type) {
          case "appReady":
            setTimeout(async () => {
              await page.mouse.click(132, 103, { button: "left" });
            }, 2000);
            break;
          case "clickMap":
            expect(`${json.longitude}`).toMatch("141.10398");
            expect(`${json.latitude}`).toMatch("39.72597");
            done();
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

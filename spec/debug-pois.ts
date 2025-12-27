import { normalizeLayers } from "../src/normalize_pois";
import poitest2Input from "./input/poitest2.json";

async function test() {
    const result = await normalizeLayers(poitest2Input.data, poitest2Input.options);
    console.log("ACTUAL OUTPUT:");
    console.log(JSON.stringify(result, null, 2));
}

test();

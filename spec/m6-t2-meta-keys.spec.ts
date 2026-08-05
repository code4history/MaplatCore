// M6-T2 spec: MaplatCore の META_KEYS / META_KEYS_OPTION lockstep と store_handler keys、AC13 の経路。
//
// AC11  META_KEYS / META_KEYS_OPTION が15件で、同じ index が camelCase / snake_case の対応
//       (licenseNote ↔ license_note / dataLicenseNote ↔ data_license_note) であること。
// AC12  store_handler.ts の histMap2Store が licenseNote / dataLicenseNote を保持すること
//       (keys 配列に含まれることの behavioral な検証)。
// AC13  ソースオプションに license_note を snake_case で渡しても normalizeArg が例外を投げず、
//       initialize 後に source.get("licenseNote") で読めること。
import { describe, it, expect } from "vitest";
import { META_KEYS, META_KEYS_OPTION } from "../src/source/mixin";
import { histMap2Store } from "../src/source/store_handler";
import { mapSourceFactory } from "../src/source_ex";

describe("m6-t2: META_KEYS lockstep", () => {
  it("AC11-1: META_KEYS が15件で licenseNote/dataLicenseNote を含む", () => {
    expect(META_KEYS).toHaveLength(15);
    expect(META_KEYS).toContain("licenseNote");
    expect(META_KEYS).toContain("dataLicenseNote");
  });

  it("AC11-2: META_KEYS_OPTION が15件で、同じ index が camelCase/snake_case 対応", () => {
    expect(META_KEYS_OPTION).toHaveLength(META_KEYS.length);
    expect(META_KEYS_OPTION).toHaveLength(15);
    const indexOfLicenseNote = META_KEYS.indexOf("licenseNote");
    const indexOfDataLicenseNote = META_KEYS.indexOf("dataLicenseNote");
    expect(indexOfLicenseNote).toBeGreaterThan(-1);
    expect(indexOfDataLicenseNote).toBeGreaterThan(-1);
    // 同じ index が snake_case 対応になっている
    expect(META_KEYS_OPTION[indexOfLicenseNote]).toBe("license_note");
    expect(META_KEYS_OPTION[indexOfDataLicenseNote]).toBe("data_license_note");
    // 全 index で camelCase/snake_case の単純対応 (添え字規則) を走査する
    META_KEYS.forEach((key, index) => {
      if (key === "licenseNote") expect(META_KEYS_OPTION[index]).toBe("license_note");
      if (key === "dataLicenseNote") expect(META_KEYS_OPTION[index]).toBe("data_license_note");
    });
  });
});

describe("m6-t2: store_handler keys", () => {
  it("AC12: histMap2Store が licenseNote/dataLicenseNote を保持する (keys 配列に含まれる)", async () => {
    const store: any = {
      title: "T",
      attr: { ja: "帰属" },
      dataAttr: {},
      license: "CC BY",
      dataLicense: "ODbL",
      licenseNote: { ja: "補足" },
      dataLicenseNote: { en: "Data note" },
      reference: "",
      description: "",
      url: "",
      lang: "ja",
      imageExtension: "jpg",
      homePosition: [135.0, 35.0],
      mercZoom: 15
    };
    const result = await histMap2Store(store, []);
    expect(result.licenseNote).toEqual({ ja: "補足" });
    expect(result.dataLicenseNote).toEqual({ en: "Data note" });
    expect(result.license).toBe("CC BY");
    expect(result.dataLicense).toBe("ODbL");
  });

});

describe("m6-t2: AC13 normalizeArg 経路 (snake_case の license_note)", () => {
  it("AC13: license_note を渡しても例外を投げず、initialize 後に source.get('licenseNote') で読める", async () => {
    const source = await mapSourceFactory(
      {
        mapID: "m6t2-license-note-probe",
        maptype: "base",
        url: "https://tiles.example.test/{z}/{x}/{y}.png",
        maxZoom: 18,
        // registerMapToSW をスキップ (weiwudi による url 上書きを避ける)
        enableCache: false,
        license: "CC BY",
        license_note: { ja: "出典: 国土地理院" },
        data_license: "ODbL",
        data_license_note: { ja: "データ補足" }
      },
      {}
    );
    expect(source.get("licenseNote")).toEqual({ ja: "出典: 国土地理院" });
    expect(source.get("dataLicenseNote")).toEqual({ ja: "データ補足" });
    expect(source.get("license")).toBe("CC BY");
    expect(source.get("dataLicense")).toBe("ODbL");
  });
});

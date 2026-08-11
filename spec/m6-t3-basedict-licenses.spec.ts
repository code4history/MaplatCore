// M6-T3 AC4: baseDict 3件 (osm/gsi/gsi_ortho) の license 系フィールド。
// mapSourceFactory 経由で baseDict の値を検証する（文字列 ID で引く経路）。
import { describe, it, expect } from "vitest";
import { mapSourceFactory } from "../src/source_ex";

async function loadBuiltin(mapID: string) {
  return mapSourceFactory(mapID, {
    // weiwudi 登録を避ける
    enableCache: false
  });
}

describe("m6-t3: baseDict licenses (AC4)", () => {
  it('osm: license="Custom", dataLicense="ODbL", licenseNote あり, dataLicenseNote なし', async () => {
    const source = await loadBuiltin("osm");
    expect(source.get("license")).toBe("Custom");
    expect(source.get("dataLicense")).toBe("ODbL");
    const note = source.get("licenseNote");
    expect(note).toBeTruthy();
    expect(typeof note).toBe("object");
    expect((note as { ja: string }).ja).toContain("OpenStreetMap Copyright");
    expect((note as { en: string }).en).toContain(
      "https://www.openstreetmap.org/copyright"
    );
    // OSM は dataLicenseNote 未設定（ODbL アイコンが表意）
    expect(source.get("dataLicenseNote")).toBeUndefined();
  });

  it('gsi: license/dataLicense="Custom" と note 双方あり', async () => {
    const source = await loadBuiltin("gsi");
    expect(source.get("license")).toBe("Custom");
    expect(source.get("dataLicense")).toBe("Custom");
    const licenseNote = source.get("licenseNote") as { ja: string; en: string };
    expect(licenseNote.ja).toContain("公共データ利用規約");
    expect(licenseNote.en).toContain("Public Data License 1.0");
    const dataLicenseNote = source.get("dataLicenseNote") as {
      ja: string;
      en: string;
    };
    expect(dataLicenseNote.ja).toContain("公共データ利用規約");
    expect(dataLicenseNote.en).toBe("Public Data License 1.0");
  });

  it("gsi_ortho: gsi と同様の license 契約", async () => {
    const source = await loadBuiltin("gsi_ortho");
    expect(source.get("license")).toBe("Custom");
    expect(source.get("dataLicense")).toBe("Custom");
    expect(source.get("licenseNote")).toBeTruthy();
    expect(source.get("dataLicenseNote")).toBeTruthy();
  });
});

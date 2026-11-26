// demo/index.ts: デモの目次（index.html）の言語の切り替え。文言は demo/i18n/index-page.ts と demo/i18n/common.ts の辞書にある。
// 比べる 2 つの型の呼び名は、リンクの data-pair（型の鍵 2 つ）から辞書の型の呼び名で組む。
import { commonDict } from "./i18n/common";
import { applyLang, detectLang, makeTranslate, mergeDicts, mountLangSwitch } from "./i18n/core";
import { dict } from "./i18n/index-page";

const lang = detectLang();
const t = makeTranslate(mergeDicts(commonDict, dict), lang);
applyLang(t, lang);
mountLangSwitch(document.getElementById("lang-switch")!, lang, t("common.lang_label"));
for (const a of document.querySelectorAll<HTMLElement>("[data-pair]")) {
  const [x, y] = a.dataset.pair!.split(",");
  a.textContent = t("type.pair", { a: t(`type.${x}`), b: t(`type.${y}`) });
}
for (const el of document.querySelectorAll<HTMLElement>("[data-badge-demo]")) {
  el.textContent = t("ix.badge_demo", { no: el.dataset.badgeDemo! });
}
for (const el of document.querySelectorAll<HTMLElement>("[data-type-note]")) {
  el.textContent = t(`type.note.${el.dataset.typeNote!}`);
}

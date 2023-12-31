/**
 * @module ol/maplat/locale/selector
 */

import { LocaleFragment } from "../types/basics";

export default function selectord(resource: LocaleFragment, locale: string) {
  if (typeof resource === 'string') {
    return resource;
  }
  if (locale === 'ja') {
    return resource.ja;
  }
  return resource.en;
}

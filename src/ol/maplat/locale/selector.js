/**
 * @module ol/maplat/locale/selector
 */

export default function selectord(resource, locale) {
  if (typeof resource === 'string') {
    return resource;
  }
  if (locale === 'ja') {
    return resource.ja;
  }
  return resource.en;
}

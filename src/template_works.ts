import { normalizeArg } from "./functions";
import type { Feature, Point } from "geojson";
import { Quyuan } from "@c4h/quyuan";

/**
 * Flatten GeoJSON Feature to legacy POI format for template processing and API compatibility
 */
export function flattenFeature(data: any): any {
  // If already a plain POI object, return as is
  if (!data.type || data.type !== "Feature") {
    return data;
  }

  // Flatten GeoJSON Feature to legacy format
  const feature = data as Feature<Point>;
  const flattened = {
    ...feature.properties,
    id: feature.id,
    lnglat: feature.geometry.coordinates,
    namespaceID: feature.properties?.namespaceID
  };

  return flattened;
}

export function prepareTemplates(...entities: any[]) {
  const template = entities.reduce((prev, curr) => {
    prev.html ||= curr.html;
    prev.htmlStyle ||= curr.htmlStyle;
    prev.icon ||= curr.icon;
    prev.selectedIcon ||= curr.selectedIcon;
    return prev;
  }, {});
  if (!template.html) delete template.html;
  if (!template.htmlStyle) delete template.htmlStyle;
  if (!template.icon) delete template.icon;
  if (!template.selectedIcon) delete template.selectedIcon;
  return template;
}

export function createFromTemplate(data: any, ...ancestors: any[]) {
  const dataCopy = structuredClone(data);
  dataCopy.properties = normalizeArg(dataCopy.properties);
  const template = prepareTemplates(...ancestors);
  Quyuan.templateExtractor({ geojson: dataCopy, templates: template });
  dataCopy.properties.html ||= dataCopy.result.html;
  dataCopy.properties.htmlStyle ||= dataCopy.result.htmlStyle;
  dataCopy.properties.icon ||= dataCopy.result.icon;
  dataCopy.properties.selectedIcon ||= dataCopy.result.selectedIcon;

  // Legacy compatibility: flatten properties and add lnglat
  if (dataCopy.properties) Object.assign(dataCopy, dataCopy.properties);
  if (data.id) dataCopy.id = data.id;
  if (dataCopy.geometry?.coordinates) dataCopy.lnglat = dataCopy.geometry.coordinates;

  return dataCopy;
}

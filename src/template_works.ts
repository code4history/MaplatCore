import template from "lodash.template";
import { normalizeArg } from "./functions";
import type { Feature, Point } from "geojson";

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

export function createIconSet(data: any, ...ancestors: any[]) {
  const flatData = flattenFeature(data);
  const dataCopy = normalizeArg(Object.assign({}, flatData));
  if (dataCopy.icon) return dataCopy;
  const fromAncestor = ancestors.reduce((prev, curr) => {
    if (prev) return prev;
    const iconTemplate = curr.iconTemplate;
    if (iconTemplate) {
      return JSON.parse(template(iconTemplate)(dataCopy));
    } else if (curr.icon) {
      return {
        icon: curr.icon,
        selectedIcon: curr.selectedIcon
      };
    }
  }, undefined);
  if (fromAncestor) {
    dataCopy.icon = fromAncestor.icon;
    dataCopy.selectedIcon = fromAncestor.selectedIcon;
  }
  return dataCopy;
}

export function createHtmlFromTemplate(data: any, ...ancestors: any[]) {
  const flatData = flattenFeature(data);
  const normalizedData = normalizeArg(flatData);
  if (normalizedData.html) return normalizedData;
  return (
    ancestors.reduce((prev, curr) => {
      if (prev) return prev;
      const poiTemplate = curr.poiTemplate;
      if (poiTemplate) {
        normalizedData.html = template(poiTemplate)(normalizedData);
        normalizedData.poiStyle = normalizedData.poiStyle || curr.poiStyle;
        return normalizedData;
      }
    }, undefined) || normalizedData
  );
}

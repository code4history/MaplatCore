/**
 * @module ol/maplat/types/specLegacy
 */

import { Coordinate2D, DataLicense, EdgeIndex, LegacyMapType, LocaleFragment, MapLicense, MaplatLegacyWeightBufferList, ValuesOfVertices } from "./basics";

/**
 * @typedef { Object } MaplatCompiledLegacy
 * @property { string } [version] Version of Maplat Compiled data scheme (New)
 * @property { Coordinate2D } [wh] Size of image (width, height) (New)
 * @property { Array<[Coordinate2D, Coordinate2D, (string | undefined)]> } points List of GCPs
 * @property { { BiDirectionKey: MaplatLegacyWeightBufferList } } weight_buffer Weight Buffer of each vertices
 * @property { [ Coordinate2D, Coordinate2D ] } centroid_point Centroid point of mapping
 * @property { [ ValuesOfVertices, ValuesOfVertices ] } vertices_params Weight parameters of map vertices
 * @property { Array<[Coordinate2D, Coordinate2D]> } vertices_points Definition of vertices points
 * @property { "strict" | "strict_error" | "loose" } strict_status Strict / loose status of mapping
 * @property { Array<Array<[EdgeIndex, EdgeIndex, EdgeIndex]>> } tins_points Vertices list of triangle polygons
 * @property { "follow" | "invert" } yaxisMode Direction of Y axis
 * @property { "plain" | "birdeye" } vertexMode Vertex location estimation mode
 * @property { "strict" | "auto" | "loose" } strictMode Strict / loose mode of mapping
 * @property { Array<[Array<Coordinate2D>, Array<Coordinate2D>, [EdgeIndex, EdgeIndex]]> } edges Edges of mapping
 * @property { Array<[Coordinate2D, Coordinate2D]> } edgesNodes Nodes of edges
 */

export interface MaplatCompiledLegacy extends Object { 
  version?: string;
  wh?: Coordinate2D;
  points: [Coordinate2D, Coordinate2D, string | undefined][];
  weight_buffer: {[key: string]: MaplatLegacyWeightBufferList};
  centroid_point: [Coordinate2D, Coordinate2D];
  vertices_params: [ValuesOfVertices, ValuesOfVertices];
  vertices_points: [Coordinate2D, Coordinate2D][];
  strict_status: "strict" | "strict_error" | "loose";
  tins_points: [EdgeIndex, EdgeIndex, EdgeIndex][][];
  yaxisMode: "follow" | "invert";
  vertexMode: "plain" | "birdeye";
  strictMode: "strict" | "auto" | "loose";
  edges: [Coordinate2D[], Coordinate2D[], [EdgeIndex, EdgeIndex]][];
  edgesNodes: [Coordinate2D, Coordinate2D][];
}

/**
 * @typedef { Object } GeoJSONPolygonGeometry
 * @property { "Polygon" } type Type of GeoJSON geometry
 * @property { Array<Array<Coordinate2D>> } coordinates Coordinates of GeoJSON geometry
 */

export interface GeoJSONPolygonGeometry extends Object { 
  type: "Polygon";
  coordinates: Coordinate2D[][];
}

/**
 * @typedef { Object } GeoJSONPolygonFeature
 * @property { "Feature" } type Type of GeoJSON
 * @property { Object<string,Object> } properties Properties of GeoJSON
 * @property { GeoJSONPolygonGeometry } geometry Geometry of GeoJSON
 */

export interface GeoJSONPolygonFeature extends Object { 
  type: "Feature";
  properties: {[key: string]: any};
  geometry: GeoJSONPolygonGeometry;
}

/**
 * @typedef { MaplatCompiledLegacy } MaplatSubMapCompiledLegacy
 * @property { Coordinate2D } xy Origin of submap (x, y)
 * @property { Array<Coordinate2D> } bounds Node list of boundary of submap
 * @property { GeoJSONPolygonFeature } boundsPolygon Polygon of Boundary of submap
 */

export interface MaplatSubMapCompiledLegacy extends MaplatCompiledLegacy { 
  xy: Coordinate2D;
  bounds: Coordinate2D[];
  boundsPolygon: GeoJSONPolygonFeature;
}

/**
 * @typedef { Object } MaplatSubMapLegacy
 * @property { number } priority Priority of sub map
 * @property { number } importance Importance of sub map
 * @property { MaplatSubMapCompiledLegacy } compiled Maplat Compiled data
 */

export interface MaplatSubMapLegacy extends Object { 
  priority: number;
  importance: number;
  compiled: MaplatSubMapCompiledLegacy;
}

/**
 * @typedef { Object } MaplatSpecLegacy
 * @property { LocaleFragment } title Title of Map (In short)
 * @property { LocaleFragment } [officialTitle] Official Title of Map (In long)
 * @property { LocaleFragment } attr Attribution of map image
 * @property { LocaleFragment } [dataAttr] Attribution of mapping
 * @property { LocaleFragment } author Author of the map
 * @property { LocaleFragment } [contributor] Contributor/Owner of the map
 * @property { LocaleFragment } [mapper] Mapper of the mapping
 * @property { LocaleFragment } [description] Description of map
 * @property { MapLicense } license License of map
 * @property { DataLicense } dataLicense License of mapping data
 * @property { LocaleFragment } createdAt The date of map was created
 * @property { LocaleFragment } [era] The era described in the map
 * @property { string } reference Reference or source of map image
 * @property { string } lang Default language
 * @property { string } [mapID] ID of map
 * @property { string } [url] URL of template of image tile data
 * @property { string } extension String of image's extension
 * @property { Array<MaplatSubMapLegacy> } sub_maps Array of sub maps
 * @property { LegacyMapType } [maptype] Type of map (Legacy)
 * @property { number } [mercatorXShift] X shift of mercator projection
 * @property { number } [mercatorYShift] Y shift of mercator projection
 * @property { Array<Coordinate2D> } [envelopLngLats] Long Lat envelop of WMTS map
 * @property { MaplatCompiledLegacy } compiled Maplat Compiled data
 * @property { number } [width] Width of image (Old)
 * @property { number } [height] Height of image (Old)
 */

export interface MaplatSpecLegacy extends Object {
  title: LocaleFragment;
  officialTitle?: LocaleFragment;
  attr: LocaleFragment;
  dataAttr?: LocaleFragment;
  author: LocaleFragment;
  contributor?: LocaleFragment;
  mapper?: LocaleFragment;
  description?: LocaleFragment;
  license: MapLicense;
  dataLicense: DataLicense;
  createdAt: LocaleFragment;
  era?: LocaleFragment;
  reference: string;
  lang: string;
  mapID?: string;
  url?: string;
  extension: string;
  sub_maps: MaplatSubMapLegacy[];
  maptype?: LegacyMapType;
  mercatorXShift?: number;
  mercatorYShift?: number;
  envelopLngLats?: Coordinate2D[];
  compiled: MaplatCompiledLegacy;
  width?: number;
  height?: number;
}

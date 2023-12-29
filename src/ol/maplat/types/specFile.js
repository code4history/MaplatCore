/**
 * @module ol/maplat/types/specFile
 */

/**
 * @typedef { Object } MaplatMetaData
 * @property { string } lang Default language
 * @property { string } [mapID] ID of map
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
 *
 */

/**
 * @typedef { Object } MaplatWorldParams
 * @property { number } xScale Scale factor of X param - a
 * @property { number } yRotation Rotation factor of Y param - d
 * @property { number } xRotation Rotation factor of X param - b
 * @property { number } yScale Scale factor of Y param - e
 * @property { number } xOrigin Origin factor of X param - c
 * @property { number } yOrigin Origin factor of Y param - f
 *
 */

/**
 * @typedef { Object } MaplatProjectionSpec
 * @property { Coordinate2D } [size] Size of image in pixel
 * @property { string } mapCoord Coordinate name of map
 * @property { MaplatWorldParams } [worldParams] World parameter transforming pixel to map coord
 * @property { string } interOperationCode Coordinate for coordinate inter operability
 * @property { "TIN" | "SHIFT" | "NONE" } warp Do map image warping or not
 * @property { [Coordinate2D, Coordinate2D] } [coordShift] Shift of map coordinate
 * @property { Array<Coordinate2D> } [envelopLngLats] Long Lat envelop of WMTS map
 *
 */

/**
 * @typedef { Object } MaplatSourceSpec
 * @property { "PIXEL" | "WMTS" | "TMS" | "IIIF" } tileSourceType Type of tile source
 * @property { string } [url] URL of template of image tile data
 * @property { string } [extension] String of image's extension
 * @property { number } [iiifNumber] Target number of IIIF images set 
 *
 */

/**
 * @typedef { Object } MaplatDefinition
 * @property { string } version Maplat definition data scheme version
 * @property { string } mapID ID of map
 * @property { MaplatMetaData } metaData Maplat's metadata of image
 * @property { MaplatProjectionSpec } projectionSpec Map's projection spec
 * @property { MaplatSourceSpec } sourceSpec Map's source spec
 *
 */

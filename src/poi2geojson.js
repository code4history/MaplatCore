import { point, featureCollection } from '@turf/helpers';

export function poi2point(poi) {
    const latitude = poi.lnglat ? poi.lnglat[1] : typeof poi.lat != 'undefined' ? poi.lat : poi.latitude;
    const longitude = poi.lnglat ? poi.lnglat[0] : typeof poi.lng != 'undefined' ? poi.lng : poi.longitude;
    delete poi.lnglat;
    delete poi.lat;
    delete poi.latitude;
    delete poi.lng;
    delete poi.longitude;

    return point([longitude, latitude], poi);
}

export function pois2featurecollection(pois, id) {
    return featureCollection(pois.map(poi => poi2point(poi)), {id: id});
}

export function layers2featurecollection(layers) {
    return featureCollection(Object.keys(layers).map(key => pois2featurecollection(layers[key], key)));
}


/*
    "name" : {
      "ja" : "盛岡城",
      "en" : "Morioka Castle"
    },
    "address" : "岩手県盛岡市内丸1-37",
    "lat" : 39.69994722,
    "lng" : 141.1501111,
    "start" : 1598,
    "desc" : "南部（盛岡）藩南部氏の居城である。西部を流れる北上川と南東部を流れる中津川の合流地、現在の盛岡市中心部にあった花崗岩丘陵に築城された連郭式平山城。",
    "image" : "moriokajo.jpg"
  }
* */
import VectorSource from 'ol/source/Vector';
function filter(source, options = {}) {
    const extent = options.extent;
    const projectTo = options.projectTo;
    const retSource = new VectorSource();
    source.forEachFeature(f => {
        const retF = f.clone();
        if (projectTo) {
            retF.setGeometry(retF.getGeometry().transform('EPSG:4326', projectTo));
        }
        if (!extent || retF.getGeometry().intersectsExtent(extent)) {
            retSource.addFeature(retF);
        }
    });
    return retSource;
}
export default filter;
//# sourceMappingURL=filter.js.map
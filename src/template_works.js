import template from 'lodash.template';

export function createIconSet(data, ...ancestors) {
    const dataCopy = Object.assign({}, data);
    if (dataCopy.icon) return dataCopy;
    const fromAncestor = ancestors.reduce((prev, curr) => {
        if (prev) return prev;
        const iconTemplate = curr.iconTemplate || curr.icon_template;
        if (iconTemplate) {
            return JSON.parse(template(iconTemplate)(dataCopy));
        } else if (curr.icon) {
            return {
                icon: curr.icon,
                selected_icon: curr.selectedIcon || curr.selected_icon
            };
        }
    }, undefined);
    if (fromAncestor) {
        dataCopy.icon = fromAncestor.icon;
        dataCopy.selected_icon = fromAncestor.selected_icon;
    }
    return dataCopy;
}

export function createHtmlFromTemplate(data, ...ancestors) {
    if (data.html) return data;
    return ancestors.reduce((prev, curr) => {
        if (prev) return prev;
        const poiTemplate = curr.poiTemplate || curr.poi_template;
        if (poiTemplate) {
            data.html = template(poiTemplate)(data);
            data.poi_style = data.poi_style || curr.poiStyle || curr.poi_style;
            return data;
        }
    }, undefined) || data;
}
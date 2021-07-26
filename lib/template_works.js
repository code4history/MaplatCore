import template from "lodash.template";
import { normalizeArg } from "./functions";
export function createIconSet(data, ...ancestors) {
    const dataCopy = normalizeArg(Object.assign({}, data));
    if (dataCopy.icon)
        return dataCopy;
    const fromAncestor = ancestors.reduce((prev, curr) => {
        if (prev)
            return prev;
        const iconTemplate = curr.iconTemplate || curr.iconTemplate;
        if (iconTemplate) {
            return JSON.parse(template(iconTemplate)(dataCopy));
        }
        else if (curr.icon) {
            return {
                icon: curr.icon,
                selectedIcon: curr.selectedIcon || curr.selectedIcon
            };
        }
    }, undefined);
    if (fromAncestor) {
        dataCopy.icon = fromAncestor.icon;
        dataCopy.selectedIcon = fromAncestor.selectedIcon;
    }
    return dataCopy;
}
export function createHtmlFromTemplate(data, ...ancestors) {
    data = normalizeArg(data);
    if (data.html)
        return data;
    return (ancestors.reduce((prev, curr) => {
        if (prev)
            return prev;
        const poiTemplate = curr.poiTemplate;
        if (poiTemplate) {
            data.html = template(poiTemplate)(data);
            data.poiStyle = data.poiStyle || curr.poiStyle;
            return data;
        }
    }, undefined) || data);
}
//# sourceMappingURL=template_works.js.map
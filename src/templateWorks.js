import template from 'lodash.template';

export function createIconSet(data, iconTemplate, fallback) {
    if (!fallback) fallback = {};
    let fromTemplate;
    if (iconTemplate) {
        fromTemplate = JSON.parse(template(iconTemplate)(data));
    }
    if (!data.icon) {
        data.icon = fromTemplate ? fromTemplate.icon : fallback.icon;
        data.selected_icon = fromTemplate ? fromTemplate.selected_icon : fallback.selected_icon;
    }
    return data;
}
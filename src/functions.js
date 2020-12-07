import { META_KEYS } from './source_ex';

export function createElement(domStr) {
    const context = document, // eslint-disable-line no-undef
        fragment = context.createDocumentFragment(),
        nodes = [];
    let i = 0;

    // ダミーのDIV要素を作成して中にテキストを挿入
    const tmp = fragment.appendChild( context.createElement('div'));
    tmp.innerHTML = domStr;

    for (; i < tmp.childNodes.length; i++) {
        // ダミーのDIV要素からHTML要素としてchildNodesで取り出せる
        const node = tmp.childNodes[i];

        // SCRIPT要素は新たに生成し直さなければ実行されない
        if (node.tagName && node.tagName.toLowerCase() === 'script') {
            const script = context.createElement('script');
            if (node.type) {
                script.type = node.type;
            }
            if (node.src) {
                script.src = node.src;
            } else {
                script.text = node.text;
            }
            nodes[i] = script;
        } else {
            // SCRIPT以外の要素
            nodes[i] = node;
        }
    }

    // HTML要素配列を返す
    return nodes;
}

export function normalizeDegree(degree) {
    while (1) { // eslint-disable-line no-constant-condition
        if (degree <= 180 && degree > -180) break;
        const times = degree > 0 ? -1.0 : 1.0;
        degree = degree + times * 360.0;
    }
    return degree;
}

export function createMapInfo(source) {
    if (!source) return;
    const ret = {
        sourceID: source.sourceID
    };
    for (let i = 0; i < META_KEYS.length; i++) {
        const key = META_KEYS[i];
        if (source[key]) {
            ret[key] = source[key];
        }
    }
    return ret;
}

export function normalizeArg(options) {
    const table = {
        maxZoom: 'max_zoom',
        minZoom: 'min_zoom',
        envelopeLngLats: 'envelope_lnglats',
        envelopLngLats: 'envelope_lnglats',
        mercatorXShift: 'mercator_x_shift',
        mercatorYShift: 'mercator_y_shift',
        mapID: 'map_id',
        sourceID: 'source_id',
//        source_id: 'source_id'
    }

    return Object.keys(table).reduce((opt, key) => {
        if (opt[key]) {
            opt[table[key]] = opt[key];
            delete opt[key];
        }
        return opt;
    }, options);
}
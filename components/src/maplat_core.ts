import { LitElement, html, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Control } from 'ol/control';

export class MaplatCore extends LitElement {
  @property({ type: String }) center;
  @property({ type: Number }) zoom;

  map?: Map;
  _mapoptions: Control[] = [];
  // 更新フラグ
  _isUpdatingCenter = false;

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .map {
      height: 100%;
      width: 100%;
    }
  `;

  constructor() {
    super();
    // プロパティの初期値をコンストラクタ内で設定
    this.center = '137.9158,34.6851';
    this.zoom = 15;
  }

  render() {
    return html`<div id="map" class="map"></div>`;
  }

  firstUpdated() {
    const mapContainer = this.shadowRoot!.querySelector('#map');
    if (mapContainer instanceof HTMLElement) {
      this.map = new Map({
        target: mapContainer,
        controls: this._mapoptions,
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
          center: fromLonLat(this.center.split(',').map(val => parseFloat(val))),
          zoom: this.zoom
        })
      });

      // 地図の移動が終了したときにイベントリスナーを呼び出す
      this.map.on('moveend', () => {
        const view = this.map!.getView();
        const center = toLonLat(view.getCenter()!).join(',');
        const zoom = view.getZoom()!;

        // プロパティを更新
        this.center = center;
        this.zoom = zoom;
      });
    } else {
      console.error('Map container not found');
    }
  }

  updated(changedProperties: PropertyValues) {
    changedProperties.forEach((value, propName) => {
      if (['center', 'zoom'].includes(propName as string)) {
        // 属性が変更されたときにカスタムイベントを発火
        const normVal:any = propName === 'center' ? this.center.split(',').map(v => parseFloat(v)) : this.zoom;
        this.dispatchEvent(new CustomEvent(`changed:${propName as string}`, { detail: normVal }));
      }
    });
  }
}

customElements.define('maplat-core', MaplatCore);
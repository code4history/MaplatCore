import { css, unsafeCSS } from 'lit';
import { MaplatCore } from './maplat_core.ts';
import { defaults as defaultControls } from 'ol/control';
import ol_css from './ol_css.ts';


export class Maplat extends MaplatCore {

  static styles = css`${MaplatCore.styles}\n${unsafeCSS(ol_css)}`;

  constructor() {
    super();
    this._mapoptions = defaultControls() as any;
  }
}

customElements.define('maplat-ui', Maplat);
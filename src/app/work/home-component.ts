import {
    html, customElement, LitElement, css
} from 'lit-element'

import '../core/common/components/centered-box'

@customElement('home-component')
export class HomeComponent extends LitElement {
    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 100%;
            flex-grow: 1;                                
        }
        `
    }
    render() {
        return html`<centered-box>HOME</centered-box>`
    }
}

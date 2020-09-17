import {
    LitElement, css, html, customElement
} from 'lit-element'

@customElement('centered-box')
export class CenteredBox extends LitElement {
    static get styles() {
        return css`
        :host {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--lumo-base-color);
        }
        `
    }
    render() {
        return html`<slot></slot>`
    }
}

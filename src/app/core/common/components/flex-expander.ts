import {
    LitElement, css, html, customElement
} from 'lit-element'

@customElement('flex-expander')
export class FlexExpander extends LitElement {
    static get styles() {
        return css`
        :host {
            flex-grow: 1;
        }
        `
    }
    render() {
        return html`<div></div>`
    }
}

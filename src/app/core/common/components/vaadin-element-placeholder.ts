import {css, customElement, html, LitElement} from "lit-element";

@customElement('vaadin-element-placeholder')
export class VaadinElementPlaceholder extends LitElement {

    static get styles() {
        // language=CSS
        return css`
            :host {
                display: inline-block;

                height: var(--lumo-size-m);
                padding: var(--lumo-space-s) calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius) / 2);
                margin: var(--lumo-space-xs) 0;

                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-m);

                background-color: var(--_lumo-button-background-color, var(--lumo-contrast-5pct));
                border-radius: var(--lumo-border-radius);

                box-sizing: border-box;
            }
        `
    }

    protected render() {
        return html`<slot></slot>
        `
    }
}
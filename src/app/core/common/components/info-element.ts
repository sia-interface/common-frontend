import {
    LitElement, css, html, customElement, property
} from 'lit-element'

@customElement('info-element')
export class InfoElement extends LitElement {
    @property({ type: String }) header: string = ''

    static get styles() {
        // language=CSS
        return css`
        :host {
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            margin: 0.4em 0.6em;
            color: gray;
            background-color: white;
            font-weight: bold;
            font-size: 1em;
            font-style: normal;
            box-sizing: border-box;            
        }
        .content {
            color: var(--lumo-primary-color);
            background-color: #fcfcfc;
            border: thin solid var(--lumo-shade-10pct);
            border-radius: 4px;
            padding: 0.2em;
            width: 100%;
            height: 1.2em;
        }
        `
    }
    render() {
        return html`
        <div>${this.header}</div>
        <div class="content"><slot></slot></div>
        `
    }
}

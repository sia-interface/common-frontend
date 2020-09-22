import {
    LitElement, css, html, customElement, property
} from 'lit-element'

export type ElementAlign =  'left' | 'center' | 'right'

export interface InfoElement {
    header: string
    content: string
    span?: number
    width?: number
    align?: ElementAlign
}

@customElement('info-panel')
export class InfoPanel extends LitElement {
    @property({ type: String }) header: string = ''
    @property({ type: Array }) elements: InfoElement[] = []

    static get styles() {
        // language=CSS
        return css`
        :host {
            display: flex;
            flex-direction: column;
            align-content: stretch;
            align-items: flex-start;
            margin: 0.4em 0.6em;
            color: gray;
            background-color: white;
            font-size: 1em;
            font-style: normal;
            box-sizing: border-box;
            border-bottom: thin solid var(--lumo-shade-10pct);
        }
        h4 {
            width: 100%;
            margin-bottom: 0;
            border-bottom: thin solid var(--lumo-shade-20pct);
        }
        h5 {
            margin: 0;
        }
        div.content {
            width: 100%;
            display: flex;
        }
        div.element {
            padding: 0.4em 0.6em;
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            border-left: thin solid var(--lumo-shade-10pct);
        }
        div.element:FIRST-CHILD {
            border-left: none;
        }
        span {
            color: darkblue;
            background-color: #f7f9fa;
            padding: 0.2em;
            width: 100%;
            height: 1.2em;
        }
        `
    }

    render() {
        return html`
        <h4>${this.header}</h4>
        <div class="content">
        ${ this.elements.map(element => {
            const flex = `flex: ${element.span ?? 1};`
            const width = `${element.width ? "max-width: " + element.width + "em;" : ""}`
            const spanStyle = `text-align: ${element.align? element.align : 'left'};`
            const style = `${flex} ${width}`
            return html`
            <div class="element" style="${style}">
              <h5>${element.header}</h5>
              <span style="${spanStyle}">${element.content}</span>
            </div>
            `
            }
        ) }        
        </div>
        `
    }
}


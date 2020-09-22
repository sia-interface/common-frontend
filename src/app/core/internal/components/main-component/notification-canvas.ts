import {
    LitElement, css, html, customElement, property
} from 'lit-element'

@customElement('notification-canvas')
export class NotificationCanvas extends LitElement {
    @property({ type: String }) severity: string = ''

    static get styles() {
        // language=CSS
        return css`
        div {
            font-weight: bold;
        }
        iron-icon {
            height: 32px;
            width: 32px;
            margin: 1em;
        }
        `
    }
    render() {
        const icon = this.severity === 'info'? 'vaadin:info-circle-o' : 'vaadin:exclamation-circle-o'
        const color = this.severity === 'info'? 'steelblue' : "darkred"
        return html`
        <div style="color: ${color}">
            <iron-icon icon="${icon}"></iron-icon>
            <slot></slot>        
        </div>
        `
    }
}

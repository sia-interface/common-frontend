import {
    LitElement, css, html, customElement
} from 'lit-element'

@customElement('info-message')
export class LoginForm extends LitElement {
    static get styles() {
        return css`
        :host {
            color: gray;
            background-color: #fcfcfc;
            font-weight: bold;
            font-size: 1em;
            font-style: normal;
            margin-left: 2px;
            margin-right: 2px;
            text-align: center;
            box-sizing: border-box;
        }
        `
    }
    render() {
        return html`<slot></slot>`
    }
}

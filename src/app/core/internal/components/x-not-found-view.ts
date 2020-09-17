import {
    html, customElement, LitElement, css
} from 'lit-element'

import {Router} from "@vaadin/router"
import {ENVIRONMENT} from '../../../../environment'
import '../../common/components/centered-box'

@customElement('x-not-found-view')
export class XNotFoundView extends LitElement {
    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 100%;
            flex-grow: 1;                                
        }
        iron-icon {
            height: 32px;
            width: 32px;
            margin: 1em;
            color: red;
        }
        `
    }

    connectedCallback() {
        super.connectedCallback();

        setTimeout(() => {
            // redirect to home
            Router.go(ENVIRONMENT.baseUrl + "/home")
        }, 5000)

    }

    render() {
        return html`<centered-box>
            <iron-icon icon="vaadin:bug-o"></iron-icon>
            <span>Nu există nimic la această adresă</span>
        </centered-box>`
    }
}

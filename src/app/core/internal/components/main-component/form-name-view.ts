import {customElement, html, css} from "lit-element";

import {MobxLitElement} from "@adobe/lit-mobx"
import '@vaadin/vaadin-button'

import {ROUTER_LISTENER_SERVICE} from "../../services/router-listener-service"
import {Router} from "@vaadin/router";
import {ENVIRONMENT} from "../../../../../environment"

@customElement('form-name-view')
export class FormNameView extends MobxLitElement {
    private routerListenerService = ROUTER_LISTENER_SERVICE

    private gohome() {
        Router.go(ENVIRONMENT.baseUrl + "/" + this.routerListenerService.currentSectionUrl)
    }

    static get styles() {
        // language=CSS
        return css`
            :host {
                display: flex;
                align-items: baseline;
                font-size: 1.1em;
                color: #3f51b5;
            }
            div {
                margin-left: 0.5em;
            }
            span:before {
                content: '/';
                font-size: 100%;
                font-weight: normal;
                color: #a2a5aa;
                margin: 5px;
                padding: 0;
            }
            span:FIRST-CHILD:before {
                content: none;
            }
        `
    }

    render() {
        const formName = this.routerListenerService.currentFormName
        return html`
        ${ formName.length > 1? 
            html`
            <vaadin-button 
                theme="icon" aria-label="Gohome"
                @click="${this.gohome}"
            ><iron-icon icon="vaadin:chevron-circle-left-o" slot="prefix"></iron-icon>
            </vaadin-button>` : html`` 
        }
        
        <div>
            ${ formName?.map(segment => html`<span>${segment}</span>`) }
        </div>
        `
    }
}

import {
    html, customElement, LitElement, query, css
} from 'lit-element'

import {Router} from "@vaadin/router"

import {ENVIRONMENT} from "../../../../../environment"
import {ROUTES} from "../../../../routes";

@customElement('advanced-router')
export class AdvancedRouter extends LitElement {
    private _router: Router;

    @query('#outlet')
    private _outlet?: HTMLElement

    constructor() {
        super();
        this._router = new Router()
        this._router.baseUrl = ENVIRONMENT.baseUrl
    }

    firstUpdated() {
        if (this._outlet) {
            this._router.setOutlet(this._outlet)
            this._router.setRoutes(ROUTES)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._router.removeRoutes()
        this._router.setOutlet(null)
    }

    static get styles() {
        // language=CSS
        return css`
            #outlet {
                height: 100%;
                flex: 1;
            }
        `
    }

    render() {
        return html`<div id="outlet"></div>`
    }

}

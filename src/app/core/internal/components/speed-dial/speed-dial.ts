import {
    html, css, customElement, property
} from 'lit-element'

import { MobxLitElement } from '@adobe/lit-mobx'
import {Router} from "@vaadin/router"
import '@vaadin/vaadin-tabs'

import { ENVIRONMENT } from '../../../../../environment'
import { SPEED_DIAL_SERVICE } from './speed-dial.service'
import { ROUTER_LISTENER_SERVICE } from '../../services/router-listener-service'

import '../../../common/components/centered-box'
import '../../../common/components/flex-expander'

@customElement('speed-dial')
export class SpeedDial extends MobxLitElement {

    @property({type: Boolean}) minified: boolean = false

    private speedDialService = SPEED_DIAL_SERVICE
    private routerListener = ROUTER_LISTENER_SERVICE
    private urls?: string[]

    async connectedCallback() {
        super.connectedCallback()

        if (this.speedDialService.sections.status == 'startup') {
            const sections = await this.speedDialService.loadSections()

            if (sections) {
                this.urls = sections.map(i => i.url)
            }
        }
    }

    private onSelectedChanged(e: CustomEvent) {
        const index = e.detail.value as number
        if (index == -1) return

        let url = "/"
        if (this.urls) {
            url = this.urls[index]
        } else if (this.speedDialService.sections.status == 'ready') {
            const urls = this.urls??this.speedDialService.sections.data.map(i => i.url)
            url = urls[index]
        }
        const pathname = ENVIRONMENT.baseUrl + url
        if (!this.routerListener.currentPathName?.startsWith(pathname)){
            Router.go(pathname)
        }
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: calc(100% - 32px);
            display: flex;
            flex-flow: column;
        }
        vaadin-tabs {
            flex: 1;
            margin: 0 auto; 
            margin-top: 16px !important;
        }
        vaadin-tabs::part(tabs) {
            display: flex;
            flex-flow: column;
        }
        vaadin-tab {
            font-size: 80%;
        }
        vaadin-tab.phirst {
            padding-top: 0.8em;
        }
        vaadin-tab.last {
            padding-bottom: 0.8em;
        }
        vaadin-tab iron-icon {
            height: 24px;
            width: 24px;
        }
        vaadin-tab.minified iron-icon {
            margin: 4px 0 4px 9em;
            height: 36px;
            width: 28px;
            box-sizing: border-box;
        }
        vaadin-tab span {
            margin-left: 0.6em;
        }        
        vaadin-tab.minified span {
            display: none;
        }
        vaadin-tab[selected] {
            border-right: 2px solid;
            border-right-color: var(--lumo-primary-text-color);
        }
        `
    }

    render() {
        if (this.speedDialService.sections.status == 'ready') {
            const urls = this.urls??this.speedDialService.sections.data.map(i => i.url)

            let selected = 1
            const currentPathname = this.routerListener.currentPathName

            // console.info("speed-dial pathname: " + currentPathname)
            if (currentPathname) {
                const pathSegmentIndex = ENVIRONMENT.baseUrl.length == 0? 1: 2
                const pathSegment = "/" + currentPathname.split("/")[pathSegmentIndex]
                // console.info("speed-dial phirst segment: " + pathSegment)
                selected = urls.indexOf(pathSegment)
            }
            if (selected == -1) {
                selected = 0
            }

            return html`            
            <vaadin-tabs 
                orientation="vertical" 
                theme="minimal" 
                selected="${selected}"
                @selected-changed="${this.onSelectedChanged}"
            >
                ${ this.speedDialService.sections.data.map(i => html`
                ${ i.divider? html`<flex-expander></flex-expander>` : html`` }
                <vaadin-tab class="${i.itemClass + (this.minified? " minified" : "")}">
                    <iron-icon icon="${i.icon}"></iron-icon>
                    <span>${i.text}</span>
                </vaadin-tab>
                `) }
            </vaadin-tabs>           
            `
        } else {
            return html`<centered-box>...</centered-box>`
        }
    }
}
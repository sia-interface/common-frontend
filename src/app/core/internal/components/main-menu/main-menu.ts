import {
    html, css, customElement
} from 'lit-element'

import { MobxLitElement } from '@adobe/lit-mobx'
import { Router, AfterEnterObserver, RouterLocation, EmptyCommands} from "@vaadin/router"

import { ENVIRONMENT } from '../../../../../environment'
import {APP_MENU} from "./app-menu.service"
import '../../../common/components/centered-box'
import {NOTIFICATION_SERVICE} from "../../services/notification.service";
import {ROUTER_LISTENER_SERVICE} from "../../services/router-listener-service";

@customElement('main-menu')
export class MainMenu extends MobxLitElement implements AfterEnterObserver {
    private static timeoutHandle: number | null = null
    private static menuUrl: string | null = null
    private appMenu = APP_MENU

    onAfterEnter(
        location: RouterLocation,
        _commands: EmptyCommands,
        _router: Router) {
        // console.info(`main-menu location: ${location.pathname}`)
        const currentPathname = location.pathname

        const pathSegmentIndex = ENVIRONMENT.baseUrl.length == 0? 1: 2
        const segements = currentPathname.split("/")
        const pathSegment = segements[pathSegmentIndex]
        // console.info("main-menu phirst segment: " + pathSegment)

        if (MainMenu.timeoutHandle) {
            window.clearTimeout(MainMenu.timeoutHandle)
            MainMenu.timeoutHandle = null
        }

        if (segements.length > pathSegmentIndex + 1) {
            // console.info("segments: " + segements.length + "; idx: " + pathSegmentIndex)
            NOTIFICATION_SERVICE.notificate('info','Nu există încă nicio implementare pentru acest element de meniu')

            // hack because of possible error in Vaadin Router
            const pathname = ENVIRONMENT.baseUrl + "/" + pathSegment
            window.history.replaceState(null, "", pathname)
            ROUTER_LISTENER_SERVICE.handleNewRoute(pathname)
        }

        console.info(`pathSegment: ${pathSegment}; menuUrl: ${MainMenu.menuUrl}`)

        if (pathSegment != MainMenu.menuUrl) {
            // load menu
            this.appMenu.loadMenu(pathSegment).then(cnt => {
                if (cnt === 0) {
                    MainMenu.timeoutHandle = window.setTimeout(() => {
                        // redirect to home
                        MainMenu.timeoutHandle = null
                        Router.go(ENVIRONMENT.baseUrl + "/home")
                    }, 5000)
                }
            })
        }

        MainMenu.menuUrl = pathSegment
    }

    static get styles() {
        // language=CSS
        return css`
            iron-icon {
                height: 32px;
                width: 32px;
                margin: 1em;
                color: red;
            }
            ul {
                font-size: 1.2em;
                margin: 2em 6em;
                padding: 0;
                display: block;
                flex-grow: 1;
                box-sizing: border-box;
            }
            li {
                list-style: none;
                margin: 0;
                font-size: 0.9em;
                color: gray;
                display: block;
            }
            li>span {
                width: 100%;
                border-bottom: 1px solid #e0e6ea;
                display: block;
                margin-top: 20px;
                box-sizing: border-box;
                text-align: left;
            }
            .menu-item {
                columns: auto 2;
                display: block;
            }

            .menu-item a {
                font-size: 110%;
                color: darkblue;
                padding: 5px;
                display: block;
                text-decoration: none;
                cursor: pointer;
                text-align: left;
            }

            .menu-item a.selected {
                text-shadow: 1px 1px 1px #65a9ff;
            }

            .menu-item a:hover {
                color: #002255;
                text-shadow: 1px 1px 1px #a5d9ff;
            }
        `
    }

    render() {
        if (this.appMenu.menu.status == 'ready') {
            const menu = this.appMenu.menu.data
            if (menu.length == 0) {
                return html`
                <centered-box>
                <iron-icon icon="vaadin:ban"></iron-icon>
                <span>Nu aveți acces la niciun element de meniu</span>
                </centered-box>
                `
            } else {
                const prefix =
                    (ENVIRONMENT.baseUrl.length == 0? "" : ENVIRONMENT.baseUrl + "/") +
                    MainMenu.menuUrl + "/"

                return html`
                <ul>
                ${ menu.map(m_group => html`
                    <li>
                    ${m_group.text && html`<span>${m_group.text}</span>` }
                    <div class="menu-item">
                    ${ m_group.items.map(m_item => html`<a href="${prefix + m_group.url + '/' + m_item.url}">${m_item.text}</a>`) }
                    </div>
                    </li>
                `)}
                </ul>
                `
            }
        } else {
            return html`
            <centered-box>LOADING...</centered-box>
            `
        }
    }
}
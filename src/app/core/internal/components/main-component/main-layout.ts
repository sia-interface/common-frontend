import {
    html, css, customElement, property, internalProperty, LitElement
} from 'lit-element'

import '@vaadin/vaadin-app-layout'
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle'
import '@vaadin/vaadin-button'
import '@vaadin/vaadin-notification'

import '../../../common/components/flex-expander'
import '../login/login-component'
import '../speed-dial/speed-dial'
import './advanced-router'
import './form-name-view'
import './notification-canvas'

import {NotificationEvent, NotificationMessage} from '../../services/notification.service'

export class UserLogoutEvent extends CustomEvent<any> {
    static eventName = "user-logout"

    constructor() {
        super(UserLogoutEvent.eventName, { bubbles: true, composed: true})
    }
}

@customElement('main-layout')
export class MainLayout extends LitElement {
    @property({ type: String }) title: string = "default title"
    @property({ type: String }) username: string = "noname"
    @internalProperty() private drawerOpened: boolean = true

    constructor() {
        super();
    }

    private drawerOpenedChanged(event: CustomEvent) {
        this.drawerOpened = event.detail.value as boolean
    }

    private logout() {
        this.dispatchEvent(new UserLogoutEvent());
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(NotificationEvent.eventName, this.listenNotifications)
    }

    listenNotifications = (event: Event) => {
        const message = (event as NotificationEvent).detail
        this.showNotification(message)
    }

    private showNotification(message: NotificationMessage) {
        const notification = this.renderRoot.querySelector('vaadin-notification')

        if (notification) {
            notification.renderer = function (root) {
                // Check if there is a content generated with the previous renderer call not to recreate it.
                if (root.firstElementChild) {
                    root.firstElementChild.remove()
                }

                // TODO: optimize render canvas if allready exists !!!

                const notificationCanvas = document.createElement('notification-canvas')
                notificationCanvas.setAttribute('severity', message.severity)
                const plainText = window.document.createTextNode(message.text)
                notificationCanvas.appendChild(plainText)

                root.appendChild(notificationCanvas)
            }

            notification.open()
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(NotificationEvent.eventName, this.listenNotifications)
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 100%;
            flex-grow: 1;                                
        }    
        .welcome {
            height: 64px;
            width: 12em;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            background: var(--lumo-base-color) linear-gradient(var(--lumo-contrast-5pct),var(--lumo-contrast-5pct));
            box-sizing: border-box;
            transition: transform var(--vaadin-app-layout-transition);
        }
        vaadin-app-layout[drawer-opened] .welcome {
            transform: translateX(0);
        }
        vaadin-app-layout .welcome {
            transform: translateX(-60%);
        }
        .welcome img {
            margin: 8px;
            display: block;
            transition: transform var(--vaadin-app-layout-transition);
        }
        vaadin-app-layout[drawer-opened] .welcome img {
            transform: translateX(0);
        }
        vaadin-app-layout .welcome img {
            transform: translateX(7.8em);
        }
        h5.title {
            color: rgb(81, 109, 160);
            font-weight: normal;
            font-size: 80%;
            margin: 0;
            transition: opacity var(--vaadin-app-layout-transition);
        }
        vaadin-app-layout[drawer-opened] h5.title {
            opacity: 1;
        }
        vaadin-app-layout h5.title {
            opacity: 0;
        }
        h5.username {
            color: rgb(81, 109, 160);
            font-weight: normal;
            font-size: 90%;
            margin: 0 0.6em;
        }
        vaadin-app-layout vaadin-drawer-toggle {
            margin-left: 10.5em;
            transform: translateX(-6.5em);
        }
        vaadin-app-layout[drawer-opened] vaadin-drawer-toggle {
            transform: translateX(0);
        }
        vaadin-app-layout::part(drawer) {
            border: none;
            background: linear-gradient(90deg,#dee0e3 0,#ebedf0 35%,var(--lumo-contrast-5pct));
            width: 12em;
            transform: translateX(-60%);
            display: flex;
            flex-flow: column;
        }
        vaadin-app-layout[drawer-opened]::part(drawer) {            
            transform: translateX(0);
        }
        form-name-view {
            margin-left: 0.4em;
            transform: translateX(-6.7em);
        }
        vaadin-app-layout[drawer-opened] form-name-view {
            transform: translateX(0);   
        }
        advanced-router {
            display: flex;
            margin-left: 5.8em;
            height: 100%;
        }
        vaadin-app-layout[drawer-opened] advanced-router {
            margin-left: 0.7em;
        }
        `
    }

    render() {
        return html`        
        <vaadin-app-layout @drawer-opened-changed="${this.drawerOpenedChanged}">
            <div class="welcome">
                <img src="images/logo.png" alt="SIA Logo" width="40" height="40" referrerpolicy="no-referrer">
                <h5 class="title"> ${this.title} </h5>
            </div>
            <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
            <form-name-view slot="navbar"></form-name-view>
            <flex-expander slot="navbar"></flex-expander>
            <h5 class="username" slot="navbar"> ${this.username} </h5>
            <vaadin-button 
                slot="navbar"
                theme="icon"  aria-label="Logout"
                @click="${this.logout}"
                ><iron-icon icon="vaadin:power-off" slot="prefix"></iron-icon></vaadin-button>

            <speed-dial slot="drawer" .minified=${!this.drawerOpened}></speed-dial>

            <advanced-router></advanced-router>
            <vaadin-notification duration="3000"></vaadin-notification>
        </vaadin-app-layout>
        `
    }

}
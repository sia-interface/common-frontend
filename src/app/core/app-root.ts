import {
     html, customElement, property
} from 'lit-element'

import { MobxLitElement } from '@adobe/lit-mobx'

import { AUTHENTICATION } from './internal/services/authentication.service'

import "./internal/components/main-menu/main-menu"
import './internal/components/x-not-found-view'

import './common/components/centered-box'
import './common/components/info-message'
import './internal/components/login/login-component'
import './internal/components/main-component/main-layout'

@customElement('app-root')
export class Application extends MobxLitElement {
    @property({ type: String }) title: string = "default title"
    @property({ type: String }) copyright: string = "default copyright"

    private authentication = AUTHENTICATION

    async connectedCallback() {
        super.connectedCallback()

        if (this.authentication.applicationStatus.status == 'startup') {
            await this.authentication.startup()
        }
    }

    private async logout() {
        await this.authentication.logout()
    }

    render() {
        let appStatus = this.authentication.applicationStatus
        return (appStatus.status === 'startup' || appStatus.status === 'process') ?
            Application.renderStartup() :
            (
                appStatus.status === 'authorized'? this.renderMainLayout(appStatus.auth.userinfo.fullname) : this.renderLoginPage()
            )
    }

    private static renderStartup() {
        return html`<centered-box><info-message>STURTUP ...</info-message></centered-box>`
    }

    private renderLoginPage() {
        return html`
            <login-component .title=${this.title} .copyright=${this.copyright}></login-component>
            `
    }

    private renderMainLayout(username: string) {
        return html`   
        <main-layout 
            .title=${this.title} 
            .username="${username}" 
            @user-logout="${this.logout}" 
        ></main-layout>           
        `
    }
    
}
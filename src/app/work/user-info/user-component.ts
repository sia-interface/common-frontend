import {
    html, customElement, LitElement, css, internalProperty
} from 'lit-element'

import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout'

import '../../core/common/components/centered-box'
import '../../core/common/components/info-panel'
import '../../core/common/components/info-message'

import {AuthInfoService} from "../../core/common/services/auth-info.service"
import type {UserInfo, UserRole} from "../../core/common/services/model"

@customElement('user-component')
export class UserComponent extends LitElement {
    @internalProperty() private roles: UserRole[] = []

    async connectedCallback() {
        super.connectedCallback();
        const userinfo = AuthInfoService.userInfo
        if (userinfo) {
            this.roles = await AuthInfoService.loadUserRoles()
        }
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 100%;
            flex-grow: 1;                                
        }
        info-panel {
            min-width: 70em;
        }
        info-message {
            margin: 1.2em 0.6em;
        }
        `
    }
    render() {
        const userinfo = AuthInfoService.userInfo
        if (userinfo) {
            const elements = [
                {header: "nr pontaj", content: userinfo.personnelNr},
                {header: "username", content: userinfo.username},
                {header: "numele și prenumele", content: userinfo.fullname, span: 2},
                {header: "email", content: userinfo.email},
                {header: "telefon de serviciu", content: userinfo.telefon},
            ]
            return html`
            <vaadin-vertical-layout>
            <info-panel header="INFORMAŢII GENERALE" .elements="${elements}"></info-panel>
            ${ UserComponent.renderAuthorizationStatus(userinfo) }
            ${ UserComponent.renderUserRoles(this.roles) }
            </vaadin-vertical-layout>`
        } else {
            return html`<centered-box><info-message>informațiile despre utilizator nu sunt disponibile</info-message></centered-box>`
        }
    }

    private static renderAuthorizationStatus(userinfo: UserInfo) {
        if (userinfo.loginStatusInfo) {
            const statusInfo = userinfo.loginStatusInfo
            const elements = [
                {header: "ultima autorizare", content: statusInfo.lastSuccessLogin},
                {header: "ultima autorizare nereușită", content: statusInfo.lastFailedLogin},
                {header: "IP de ultima autorizare", content: statusInfo.lastSuccessLoginIP},
                {header: "IP de autorizare nereușită", content: statusInfo.lastFailedLoginIP}
            ]
            return html`
            <info-panel header="STATUTUL AUTORIZAŢIEI" .elements="${elements}"></info-panel>
            `
        } else {
            return html`<info-message>Statutul autorizației nu sunt disponibil</info-message>`
        }
    }

    private static renderUserRoles(roles: UserRole[]) {
        if (roles.length > 0) {
            const elements = roles.map(r => (
                {header: r.roleName, content: r.roleDescription, width: 17}
                ))
            return html`
            <info-panel header="ROLURILE UTILIZATORULUI" .elements="${elements}"></info-panel>
            `
        } else {
            return html`<info-message>Utilizator nu are nici un role</info-message>`
        }
    }
}

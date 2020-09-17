import {
    html, customElement, property
} from 'lit-element'

import { MobxLitElement } from '@adobe/lit-mobx'

import './login-layout'
import { UserLoginEvent } from './login-form'
import { AUTHENTICATION } from '../../services/authentication.service'

@customElement('login-component')
export class LoginComponent extends MobxLitElement {
    @property({ type: String }) title: string = "default title"
    @property({ type: String }) copyright: string = "default copyright"

    private auth = AUTHENTICATION

    private async login(e: UserLoginEvent) {
        await this.auth.login(e.detail)
    }

    render() {
        return html`
            <login-layout 
                .title="${this.title}" 
                .copyright="${this.copyright}" 
                .errorMessage="${this.auth.errorMessage}"
                @user-login="${this.login}"
            ></login-layout>
            `
    }

}
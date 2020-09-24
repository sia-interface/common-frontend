import {
    LitElement, css, html, customElement, property, internalProperty, query
} from 'lit-element'

import '@vaadin/vaadin-button'
import '@vaadin/vaadin-form-layout'
import '@vaadin/vaadin-text-field'
import '@vaadin/vaadin-text-field/vaadin-password-field'

import { AuthRequest } from '../../services/model'

import '../../../common/components/error-message'

// https://cdn.vaadin.com/vaadin-app-layout/2.0.2/demo/#element-basic-demos
// https://vaadin.com/components/vaadin-form-layout/html-api

export class UserLoginEvent extends CustomEvent<AuthRequest> {
    static eventName = "user-login"

    constructor(detail: AuthRequest) {
        super(UserLoginEvent.eventName, { detail, bubbles: true, composed: true})
    }
}

@customElement('login-form')
export class LoginForm extends LitElement {
    @property({ type: String }) errorMessage: string = ''

    @query('#name') name?: HTMLInputElement;
    @query('#pw') pw?: HTMLInputElement;

    @internalProperty() private disabled: boolean = true;

    private login() {
        let username = this.name!.value
        let password = this.pw!.value
        this.dispatchEvent(new UserLoginEvent({username, password}))
    }

    private onChange() {
        this.disabled = this.name!.value.length == 0 || this.pw!.value.length == 0
    }

    private shortcutListener(e: KeyboardEvent) {
        if (e.key == 'Enter') {
            if (e.target == this.name) {
                this.pw!.focus()
            } else if (e.target == this.pw) {
                if (!this.disabled) this.login()
            }
        }
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 30%;
            width: 50%;
        }
        form {
            display: flex;
        }
        vaadin-form-layout {
            width: 100%;
        }
        error-message {
            margin-top: 2em;
            width: 100%;
        }
        #name, #pw {
            width: calc(40% - 1em) !important;
            margin-left: 0 !important;
            margin-right: 1em !important;
        }
        #btn {
            width: calc(20% - 2em) !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        `
    }

    private renderErrorMessage() {
        return html`<error-message>${this.errorMessage}</error-message>`
    }

    private renderForm() {
        return html`
        <vaadin-form-layout 
                aria-autocomplete="none" 
                @keyup="${this.shortcutListener}">
            <input id="password" type="password" name="password" style="display: none">

            <vaadin-text-field 
                id="name"
                label="Utilizator" 
                placeholder="nick name (porecla)" 
                @input="${this.onChange}" 
                autofocus required></vaadin-text-field>

            <vaadin-password-field 
                id="pw"
                label="Parola" 
                placeholder="Introduceti parola" 
                @input="${this.onChange}" 
                ></vaadin-password-field>

            <vaadin-button 
                id="btn"
                theme="primary" 
                @click="${this.login}"
                ?disabled="${this.disabled}">LOGIN</vaadin-button>
        </vaadin-form-layout>
        `
    }

    render() {
        return html`
        <form> ${this.errorMessage != ''? this.renderErrorMessage() : this.renderForm()} </form>
        `
    }
}
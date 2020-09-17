import {
    html, css, customElement, property, LitElement
} from 'lit-element'

import './login-form'

@customElement('login-layout')
export class LoginComponent extends LitElement {
    @property({ type: String }) title: string = "default title"
    @property({ type: String }) copyright: string = "default copyright"
    @property({ type: String }) errorMessage: string = ''

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: 100%;
            flex-grow: 1;
        }    
        main {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            height: 50%;     
            background-color: #f8f8f8;
            border-top: #d0d8e2 solid thin;
            border-bottom: #d0d8e2 solid thin;

        }
        aside {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 25%;
            text-align: center; 
            background-color: #e0e8ef;    
        }
        h3 {
            color: gray;
            margin: 0 !important;
        }
        h5 {
            color: rgb(61, 109, 180);
            margin: 0.3em 0 !important;
        }
        .welcome {
            width: 50%;
            display: flex;
            flex-flow: column;
            align-items: center;
            font-size: 120%;
            margin-bottom: 2%
        }
        `
    }

    render() {
        return html`
            <aside>${this.title}</aside>
            
            <main>
                <div class="welcome">
                <h3>VĂ SALUT</h3>
                <h5>INTRARE LA WEB-SERVICIILE</h5>
                </div>          
                <login-form errorMessage="${this.errorMessage}"></login-form>
            </main>
    
            <aside>${this.copyright}</aside>
            `
    }

}
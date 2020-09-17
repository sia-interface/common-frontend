import { observable, action, computed } from 'mobx'

import type { ApplicationStatus, Authentication, AuthRequest } from "./model"
import type {ResourceStatus, UserInfo} from "../../common/services/model"
import {HttpService, isString} from './http.service'

const SESSION_STORAGE = 'authentication-info'

export class AuthenticationService {
    
    @observable
    public applicationStatus: ApplicationStatus = { status: 'startup' }

    @observable
    public auth: ResourceStatus<Authentication> = { status: 'startup' }

    @computed
    public get authorizationToken() {
        return this.applicationStatus.status == 'authorized'? this.applicationStatus.auth.access_token : null
    }

    @computed 
    public get userInfo() {
        return this.applicationStatus.status == 'authorized'? this.applicationStatus.auth.userinfo : null
    }

    @computed 
    public get errorMessage() {
        return this.auth.status == 'error' ? this.auth.message : ''
    }

    constructor(private authServiceUrl: string) {}

    @action
    async startup() {
        this.applicationStatus = { status: 'process' }
        let storedAuth = sessionStorage.getItem(SESSION_STORAGE)
        if (storedAuth) {
            let authentication = JSON.parse(storedAuth) as Authentication
            try {
                await this.loadAuthInfo(authentication)
            } catch (ex) {
                // authorization, move to unauthorized state
                // and show error message
                sessionStorage.removeItem(SESSION_STORAGE);
                this.applicationStatus = { status: 'auth-procecss'}
                const errorText = ex.message?? String(ex)
                this.showAuthError(errorText, false)
            }   
        } else {
            // auth token not exists, move to unauthorized state
            // and show login form
            this.auth = { status: 'startup' }
            this.applicationStatus = { status: 'auth-procecss'}
        }
    }

    @action
    async login(body: AuthRequest) {
        try {
            let authentication = await HttpService.post<Authentication>(this.authServiceUrl + "/auth/authenticate", { body })
            sessionStorage.setItem(SESSION_STORAGE, JSON.stringify(authentication))
            await this.loadAuthInfo(authentication)
        } catch (ex) {
            let takesLongWait = false
            if (ex.takesLongWait) {
                takesLongWait = true
            }
            const errorText = ex.message && isString(ex.message)? ex.message : ex as string
            this.showAuthError(errorText, takesLongWait)
        }
    }

    @action
    async logout() {
        try {
            await HttpService.post(this.authServiceUrl + "/auth/logout", { body: null, contentType: "json" })
        } finally {
            sessionStorage.removeItem(SESSION_STORAGE);
            this.auth = { status: 'startup' }
            this.applicationStatus = { status: 'auth-procecss'}
        }
    }

    @action
    relogin() {
        sessionStorage.removeItem(SESSION_STORAGE);
        this.applicationStatus = { status: 'auth-procecss'}
        this.showAuthError("A expirat perioada de autentificare", false)
    }

    private async loadAuthInfo(authentication: Authentication) {
        let authorizationToken = authentication.access_token
        let userinfo = await HttpService.get<UserInfo>(this.authServiceUrl + "/auth/user-info", {authorizationToken})
        this.auth = { status: 'ready',  data: authentication }
        this.applicationStatus = { status: 'authorized', auth: {access_token: authentication.access_token, userinfo} }        
    }

    private showAuthError(message: string, takesLongWait: boolean) {
        const timeout = takesLongWait? 30000 : 5000

        this.auth = { status: 'error',  message }
        setTimeout(() => {
                // show login form
                this.auth = { status: 'startup' }
            }, timeout)
    }

}

import { ENVIRONMENT } from '../../../../environment'

// https://cdn.vaadin.com/vaadin-app-layout/2.0.2/demo/#element-basic-demos
// https://vaadin.com/components/vaadin-form-layout/html-api

// initialize AuthenticationService
export const AUTHENTICATION = new AuthenticationService(ENVIRONMENT.authServiceUrl)

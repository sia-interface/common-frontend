import {HttpService} from "../../internal/services/http.service"
import {AUTHENTICATION} from "../../internal/services/authentication.service"

export class UserHttpService {

    // generic request
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'arraybuffer'
    }): Promise<ArrayBuffer>;
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'blob'
    }): Promise<Blob>;
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'text'
    }): Promise<string>;
    static request<R>(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType?: 'json'
    }): Promise<R>;
    static async request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType?: 'arraybuffer'|'blob'|'json'|'text'
    } = {}): Promise<any> {
        const authorizationToken = AUTHENTICATION.authorizationToken
        if (authorizationToken) {
            const opt = {...options, authorizationToken} as any
            try {
                return await HttpService.request(method, url, opt)
            } catch (err) {
                // auth error
                if (err.status && err.status === 401) {
                    // show message and go to login
                    AUTHENTICATION.relogin()
                }
                throw err
            }
        } else {
            console.error("authorizationToken not found in UserHttpService!")
        }
    }

    // get request
    static get(url: string, options: {
        responseType: 'arraybuffer'
    }): Promise<ArrayBuffer>;
    static get(url: string, options: {
        responseType: 'blob'
    }): Promise<Blob>;
    static get(url: string, options: {
        responseType: 'text'
    }): Promise<string>;
    static get<R>(url: string, options: {
        responseType?: 'json'
    }): Promise<R>;
    static get(url: string, options: {
        responseType?: 'arraybuffer'|'blob'|'json'|'text'
    } = {}): Promise<any> {
        return UserHttpService.request<any>('GET', url, options as any)
    }

    // post request
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'arraybuffer'
    }): Promise<ArrayBuffer>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'blob'
    }): Promise<Blob>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'text'
    }): Promise<string>;
    static post<R>(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType?: 'json'
    }): Promise<R>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType?: 'arraybuffer'|'blob'|'json'|'text'
    }): Promise<any> {
        return UserHttpService.request<any>('POST', url, options as any)
    }

}

/*
export function encodeQuery(url: string, body: any): string {
    let esc = encodeURIComponent
    let query = Object.keys(body)
        .map(k => esc(k) + '=' + esc(body[k]))
        .join('&')
    return url + "?" + query
}
*/
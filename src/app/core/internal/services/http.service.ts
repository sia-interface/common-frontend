import {NOTIFICATION_SERVICE} from "./notification.service";

const HEADER_CONTENT_TYPE: string = 'Content-Type';

const CONTENT_TYPE_FORM: string = 'application/x-www-form-urlencoded'
const CONTENT_TYPE_JSON: string = 'application/json'

export const ERR_UNAUTHORIZED_TEXT = "Autentificarea a eșuat"

const ERR_NOTFOUND_TEXT = "Resursa nu a fost găsită pe server"
const ERR_DEFAULT = "Eroare neașteptată de interacţiune cu serverul"
const ERR_HTTP_REQUEST_INVALID = 'HTTP request greşit'
const ERR_FAILED_TO_FETCH = 'Nu a fost făcută legatura cu serverul'
const ERR_INTERNAL_ERROR = 'Eroare internala la server'

export interface ErrorMessage {
    status: number
    message: string
}

export interface AuthenticationFailed extends ErrorMessage {
    authenticated: false
    takesLongWait: boolean
}

// https://github.com/angular/angular/blob/master/packages/common/http/src/client.ts

export class HttpService {

    // generic request 
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'arraybuffer',
        authorizationToken?: string,
    }): Promise<ArrayBuffer>;
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'blob'
        authorizationToken?: string,
    }): Promise<Blob>;
    static request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType: 'text'
        authorizationToken?: string,
    }): Promise<string>;
    static request<R>(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType?: 'json',
        authorizationToken?: string,
    }): Promise<R>;
    static async request(method: string, url: string, options: {
        body?: any,
        contentType?: 'json' | 'form',
        responseType?: 'arraybuffer'|'blob'|'json'|'text',
        authorizationToken?: string,
    } = {}): Promise<any> {
        const headers = options && options.contentType === 'form'? generateFormHeaders() : generateJsonHeaders()

        if (options.authorizationToken) {
            headers.append('Authorization', `Bearer ${options.authorizationToken}`)
        }

        const params = {
            body: options? (
                options.contentType === 'form'? options.body : JSON.stringify(options.body)
            ) : undefined,
            method,
            headers,
        }
        try {
            const response = await fetch(url, params)

            if (response.status != 200) {
                let errorMessage = await handleErrorStatus(response)
                throw errorMessage
            }

            switch (options.responseType) {
                case 'arraybuffer': return await response.arrayBuffer()
                case 'blob': return await response.blob()
                case 'text': return await response.text()
                default: return await response.json()
            }
        } catch (err) {
            const errorText = err instanceof TypeError && err.message === 'Failed to fetch' ?
                ERR_FAILED_TO_FETCH :
                ( err.message && isString(err.message)? err.message : ERR_DEFAULT )

            console.error(errorText)

            // auth error
            if (err.status === 401) throw err

            NOTIFICATION_SERVICE.notificate('error', errorText)

            throw errorText
        }
    }

    // get request
    static get(url: string, options: {
        responseType: 'arraybuffer',
        authorizationToken?: string,
    }): Promise<ArrayBuffer>;
    static get(url: string, options: {
        responseType: 'blob',
        authorizationToken?: string,
    }): Promise<Blob>;
    static get(url: string, options: {
        responseType: 'text',
        authorizationToken?: string,
    }): Promise<string>;
    static get<R>(url: string, options: {
        responseType?: 'json',
        authorizationToken?: string,
    }): Promise<R>;
    static get(url: string, options: {
        responseType?: 'arraybuffer'|'blob'|'json'|'text',
        authorizationToken?: string,
    } = {}): Promise<any> {
        return HttpService.request<any>('GET', url, options as any)
    }

    // post request
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'arraybuffer',
        authorizationToken?: string,
    }): Promise<ArrayBuffer>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'blob',
        authorizationToken?: string,
    }): Promise<Blob>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType: 'text',
        authorizationToken?: string,
    }): Promise<string>;
    static post<R>(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType?: 'json',
        authorizationToken?: string,
    }): Promise<R>;
    static post(url: string, options: {
        body: any,
        contentType?: 'json' | 'form',
        responseType?: 'arraybuffer'|'blob'|'json'|'text',
        authorizationToken?: string,
    }): Promise<any> {
        return HttpService.request<any>('POST', url, options as any)
    }

}

async function handleErrorStatus(response: Response): Promise<ErrorMessage> {
    const status = response.status
    switch (status) {
        case 204:
            return { status, message: 'No data' }
        case 400: {
            return { status, message: ERR_HTTP_REQUEST_INVALID }
        }
        case 401: {
            try {
                let data = await response.json() as AuthenticationFailed
                if (data && data.message) {
                    return { ...data, status }
                }
            } catch (_) { }
            return { status, message: ERR_UNAUTHORIZED_TEXT, authenticated: false } as AuthenticationFailed
        }
        case 404: return { status, message: ERR_NOTFOUND_TEXT }
        case 500: {
            return { status, message: ERR_INTERNAL_ERROR }
        }
        default:
            return { status, message: response.statusText }
    }
}

function generateJsonHeaders() {
    let headers = new Headers()
    headers.append(HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON)
    return headers
}

function generateFormHeaders() {
    let headers = new Headers()
    headers.append(HEADER_CONTENT_TYPE, CONTENT_TYPE_FORM)
    return headers
}

export function encodeQuery(url: string, body: any): string {
    let esc = encodeURIComponent
    let query = Object.keys(body)
        .map(k => esc(k) + '=' + esc(body[k]))
        .join('&')
    return url + "?" + query
}

export function parseQueryString(querystring: string): Map<string, string> {
    // remove any preceding url and split
    let qs = querystring.substring(querystring.indexOf('?') + 1).split('&')
    var params: Map<string, string> = new Map()
    
    // march and parse
    for (var i = qs.length - 1; i >= 0; i--) {
        let pair = qs[i].split('=')
        let key = decodeURIComponent(pair[0])
        let val = decodeURIComponent(pair[1] || '')
        params.set(key, val)
    }
    return params
}

export function isString(val: any) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
}

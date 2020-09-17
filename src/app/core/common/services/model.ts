// general status of processing all kinds of resources
export type ResourceStatus<T> =
    { status: 'startup' } |
    { status: 'process'} |
    { status: 'error', message: string } |
    { status: 'ready',  data: T }

export interface UserInfo {
    id:          number
    username:    string
    fullname:    string
    personnelNr: string
    telefon:     string
    email:       string
    loginStatusInfo?: UserLoginStatusInfo
}

export interface UserRole {
    roleName:        string
    roleDescription: string
}

export interface UserLoginStatusInfo {
    lastSuccessLogin:   string
    lastFailedLogin:    string
    lastSuccessLoginIP: string
    lastFailedLoginIP:  string
}

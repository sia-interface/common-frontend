import {UserInfo} from "../../common/services/model"

export interface AuthRequest {
    username: string
    password: string
}

export interface Authentication {
    username:     string
    access_token: string
}

export interface AuthenticationInfo {
    access_token: string
    userinfo:     UserInfo
}

export type ApplicationStatus = 
    { status: 'startup'} |
    { status: 'process' } | 
    { status: 'auth-procecss' } | 
    { status: 'authorized', auth: AuthenticationInfo }
    
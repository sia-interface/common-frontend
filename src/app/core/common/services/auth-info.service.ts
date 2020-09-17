import {AUTHENTICATION} from "../../internal/services/authentication.service"
import {ENVIRONMENT} from "../../../../environment";
import {UserHttpService} from "./http-service";
import {UserRole} from "./model";

export class AuthInfoService {
    public static get userInfo() {
        return AUTHENTICATION.userInfo
    }

    public static get authorizationToken() {
        return AUTHENTICATION.authorizationToken
    }

    public static loadUserRoles(): Promise<UserRole[]> {
        return UserHttpService.get<UserRole[]>(ENVIRONMENT.authServiceUrl + '/auth/user-roles', {})
    }
}
import { observable, action } from 'mobx'

import type {ResourceStatus} from "../../../common/services/model"
import {UserHttpService} from "../../../common/services/http-service"

export interface MenuGroup {
    url: string;
    text: string;
    items: MenuItem[]
}

export interface MenuItem {
    url: string;
    text: string;
}

export class AppMenuService {

    constructor(private authServiceUrl: string) {}

    @observable
    public menu: ResourceStatus<MenuGroup[]> = { status: 'startup'}

    @action
    async loadMenu(pathSegment: string) {
        this.menu = { status: 'process' }
        try {
            let data = await UserHttpService.get<MenuGroup[]>(this.authServiceUrl + '/core/menu/groups/' + pathSegment, {})
            this.menu = { status: 'ready',  data }
            return data.length
        } catch (ex) {
            this.menu = { status: 'error',  message: ex }
            return 0
        }
    }

}

import { ENVIRONMENT } from '../../../../../environment'

export const APP_MENU = 
    new AppMenuService(ENVIRONMENT.authServiceUrl)

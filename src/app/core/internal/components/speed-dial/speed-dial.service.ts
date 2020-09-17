import { observable, action } from 'mobx'

import type {ResourceStatus} from "../../../common/services/model"
import {UserHttpService} from "../../../common/services/http-service"

export interface SpeedDialGroup {
    section: string;
    items: SpeedDialItem[];
}

export interface SpeedDialItem {
    url: string;
    icon: string;
    text: string;

    itemClass: string
    divider: boolean
}

export class SpeedDialService {

    constructor(private authServiceUrl: string) {}

    @observable
    public sections: ResourceStatus<SpeedDialItem[]> = { status: 'startup'}

    @action
    async loadSections() {
        this.sections = { status: 'process' }
        try {
            let data = await UserHttpService.get<SpeedDialItem[]>(this.authServiceUrl + '/core/menu/speed-dial-items', {} )
            this.sections = { status: 'ready',  data }
            return data
        } catch (ex) {
            this.sections = { status: 'error',  message: ex }
            return null
        }
    }

}

import { ENVIRONMENT } from '../../../../../environment'

export const SPEED_DIAL_SERVICE =
    new SpeedDialService(ENVIRONMENT.authServiceUrl)

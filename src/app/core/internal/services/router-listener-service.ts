import {action, observable, runInAction} from 'mobx'
import {ENVIRONMENT} from "../../../../environment"
import {UserHttpService} from "../../common/services/http-service"

export type FormName = string[]

class RouterListenerService {

    @observable
    public currentPathName?: string

    private currentFormUrl: string = ""
    public currentSectionUrl: string = ""

    @observable
    public currentFormName: string[] = []

    constructor(private authServiceUrl: string) {
        window.addEventListener('vaadin-router-location-changed', (event) => {
            // const breadcrumbs = document.querySelector('#breadcrumbs');
            // breadcrumbs.innerHTML = `You are at '${event.detail.location.pathname}'`;
            const pathname = (event as CustomEvent).detail.location.pathname
            this.handleNewRoute(pathname);
        });
    }

    public handleNewRoute(pathname: string) {
        const segments = pathname.split("/")
        const pathSegmentIndex = ENVIRONMENT.baseUrl.length == 0 ? 1 : 2

        // TODO: special form-url for utilizator (user)

        const formUrl = segments.length == (pathSegmentIndex+1) && segments[pathSegmentIndex] === "user"? "user" :
            ( segments.length >= pathSegmentIndex + 3 ?
            segments.slice(pathSegmentIndex, 3 + pathSegmentIndex).join("/") : "" )

        console.info("RouterListenerService form-url: " + formUrl)

        if (formUrl.length > 0 && formUrl !== this.currentFormUrl) {
            this.loadFormName(formUrl)
        } else {
            runInAction("clear form-name", () => {
                this.currentFormName = [] as string[]
            })
        }
        this.currentFormUrl = formUrl
        this.currentSectionUrl = segments[pathSegmentIndex]

        runInAction("change observed location pathname", () => {
            this.currentPathName = pathname
        })
    }

    @action
    private async loadFormName(formUrl: string) {
        if (formUrl === "user") {
            this.currentFormName = [ "Informaţie despre utilizator" ]
            return
        }
        try {
            const formname = await UserHttpService.get<string[]>(this.authServiceUrl + '/core/menu/form-name/' + formUrl, {})
            if (this.currentFormUrl.length > 0) {
                // because of async load of current formname
                this.currentFormName = formname
            } else {
                this.currentFormName = [] as string[]
            }
            console.info("RouterListenerService formname: " + this.currentFormName)
        } catch (ex) {
            this.currentFormName = [] as string[]
        }
    }

}

export const ROUTER_LISTENER_SERVICE = new RouterListenerService(ENVIRONMENT.authServiceUrl)

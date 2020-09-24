import {
    html, customElement, css, LitElement, query
} from 'lit-element'

import '@vaadin/vaadin-dialog'
import '@vaadin/vaadin-upload'
import { UploadElement, UploadFile } from '@vaadin/vaadin-upload'

import '../../../core/common/components/info-message'

import {ENVIRONMENT} from "../../../../environment"
import {AuthInfoService} from "../../../core/common/services/auth-info.service"

import {UploadResult} from "./model"
import {CloseDialogEvent} from "../../../core/common/utils"

import './upload-and-calculations-status'
import './report-control'
import './report-view'
import {UploadAndCalculationsStatus} from "./upload-and-calculations-status"
import {ReportControl, ShowReportEvent} from "./report-control"
import {ReportView} from "./report-view"

@customElement('billing-indications-excel')
export class IndicationsExcel extends LitElement {
    static uploadTarget = ENVIRONMENT.billingServiceUrl + "/indications/excel/upload"

    @query("vaadin-upload") _uploadElement?: UploadElement
    @query("vaadin-dialog") _vaadinDialog?: HTMLElement
    @query("indications-excel-report-control") _reportControl?: ReportControl
    @query("indications-excel-report-view") _reportView?: ReportView

    firstUpdated() {
        // super.connectedCallback();
            console.info("upload element found");

        this._uploadElement!.headers = {
            'Authorization': `Bearer ${AuthInfoService.authorizationToken}`
        }

        this._uploadElement!.addEventListener('upload-before', this.listenUploadBefore)
        this._uploadElement!.addEventListener('upload-response', this.listenUploadResponse)

        document.addEventListener(CloseDialogEvent.eventName, (e) => {
            (this._vaadinDialog as any).opened = false;
            this._reportControl!.refresh(e)
        })
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener(CloseDialogEvent.eventName, this.listenCloseDialog)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(CloseDialogEvent.eventName, this.listenCloseDialog)
    }

    private onShowReport(event: ShowReportEvent) {
        this._reportView!.showReport(event.detail)
    }

    private onClearReport() {
        this._reportView!.clearReport()
    }

    listenCloseDialog = (_event: Event) => {
        (this._vaadinDialog as any).opened = false
        this._uploadElement!.files = []
    }

    listenUploadBefore = (event: Event) => {
        const file = (event as CustomEvent).detail.file as UploadFile
        console.info("file for upload: " + file.name + "; upload target: " + file.uploadTarget)
    }

    listenUploadResponse = (event: Event) => {
        const xhr = (event as CustomEvent).detail.xhr as XMLHttpRequest
        if (xhr.status == 200) {
            const uploadResult = JSON.parse(xhr.response) as UploadResult
            const dialog = this._vaadinDialog as any

            dialog.renderer = function(root: any, _dialog: any) {
                if (root.firstElementChild) {
                    root.firstElementChild.remove()
                }

                const uploadStatus = document.createElement('upload-and-calculations-status') as UploadAndCalculationsStatus
                uploadStatus.uploadResult = uploadResult
                root.appendChild(uploadStatus)
            }

            dialog.opened = true
        }
        console.info("file uploaded")
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: calc(100% - 4em);
            flex-grow: 1;   
            display: flex;
            flex-direction: column;
            margin-top: 3em;
            align-items: center;
            box-sizing: border-box;
        }
        span {
            margin-top: 1em;
        }
        span em {
            color: steelblue;
            font-style: normal;
            font-weight: bold;
        }
        indications-excel-report-control {
            margin-top: 4em;
        }
        indications-excel-report-view {
            height: 100%;
        }
        `
    }

    // maximum file size 256Kb
    render() {
        return html`
        <vaadin-upload 
            nodrop 
            max-files="1" 
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            max-file-size="256000"
            target="${IndicationsExcel.uploadTarget}"
        ></vaadin-upload>
        <span>prelucrare <em>.XLSX</em> fişiere (de la 2007 format standard al MICROSOFT OFFICE)</span>
        <vaadin-dialog no-close-on-esc no-close-on-outside-click></vaadin-dialog>
        <indications-excel-report-control 
            @indications-excel-show-report="${this.onShowReport}"
            @indications-excel-clear-report="${this.onClearReport}"
        ></indications-excel-report-control>
        <indications-excel-report-view></indications-excel-report-view>
        `
    }

}

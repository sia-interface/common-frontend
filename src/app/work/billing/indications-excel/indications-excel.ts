import {
    html, customElement, css, LitElement
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
import {UploadAndCalculationsStatus} from "./upload-and-calculations-status"
import {ReportControl} from "./report-control";

@customElement('billing-indications-excel')
export class IndicationsExcel extends LitElement {
    static uploadTarget = ENVIRONMENT.billingServiceUrl + "/indications/excel/upload"

    firstUpdated() {
        // super.connectedCallback();
        const uploadElement = this.shadowRoot!.querySelector('vaadin-upload')
        if (uploadElement) {
            console.info("upload element found");

            (uploadElement as UploadElement).headers = {
                'Authorization': `Bearer ${AuthInfoService.authorizationToken}`
            }

            uploadElement.addEventListener('upload-before', this.listenUploadBefore)
            uploadElement.addEventListener('upload-response', this.listenUploadResponse)
        }

        const dialog = this.shadowRoot!.querySelector('vaadin-dialog') as any
        if (dialog) {
            document.addEventListener(CloseDialogEvent.eventName, (e) => {
                dialog.opened = false;

                const reportControl = this.shadowRoot!.querySelector('report-control') as ReportControl
                reportControl.refresh(e)
            })
        }
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener(CloseDialogEvent.eventName, this.listenCloseDialog)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(CloseDialogEvent.eventName, this.listenCloseDialog)
    }

    listenCloseDialog = (_event: Event) => {
        const dialog = this.shadowRoot!.querySelector('vaadin-dialog') as any
        const uploadElement = this.shadowRoot!.querySelector('vaadin-upload')
        if (dialog && uploadElement) {
            dialog.opened = false;
            (uploadElement as UploadElement).files = [];
        }
    }

    listenUploadBefore = (event: Event) => {
        const file = (event as CustomEvent).detail.file as UploadFile
        console.info("file for upload: " + file.name + "; upload target: " + file.uploadTarget)
    }

    listenUploadResponse = (event: Event) => {
        const xhr = (event as CustomEvent).detail.xhr as XMLHttpRequest
        if (xhr.status == 200) {
            const uploadResult = JSON.parse(xhr.response) as UploadResult
            const dialog = this.shadowRoot!.querySelector('vaadin-dialog') as any

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
        report-control {
            margin-top: 4em;
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
        <report-control></report-control>
        `
    }

}

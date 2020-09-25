import {
    html, customElement, css, LitElement, query
} from 'lit-element'

import '@vaadin/vaadin-dialog'

import '../../../core/common/components/info-message'
import '../../../core/common/components/select-file'

import {FileSelectedEvent, SelectFile} from "../../../core/common/components/select-file"

import {CloseDialogEvent} from "../../../core/common/utils"

import './upload-and-calculations-status'
import './report-control'
import './report-view'
import {UploadAndCalculationsStatus} from "./upload-and-calculations-status"
import {ReportControl, ShowReportEvent} from "./report-control"
import {ReportView} from "./report-view"

@customElement('billing-indications-excel')
export class IndicationsExcel extends LitElement {
    @query("select-file") _selectFile?: SelectFile
    @query("vaadin-dialog") _vaadinDialog?: HTMLElement
    @query("indications-excel-report-control") _reportControl?: ReportControl
    @query("indications-excel-report-view") _reportView?: ReportView

    firstUpdated() {
        document.addEventListener(CloseDialogEvent.eventName, (e) => {
            (this._vaadinDialog as any).opened = false;
            this._selectFile!.disabled = false
            this._reportControl!.refresh(e)
        })
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    private onFileSelected(event: FileSelectedEvent) {
        this._selectFile!.disabled = true

        const dialog = this._vaadinDialog as any
        dialog.renderer = function(root: any, _dialog: any) {
            if (root.firstElementChild) {
                root.firstElementChild.remove()
            }

            const uploadStatus = document.createElement('upload-and-calculations-status') as UploadAndCalculationsStatus
            root.appendChild(uploadStatus)

            uploadStatus.loadAndShowCalcStatus(event.detail)
        }

        dialog.opened = true
    }

    private onShowReport(event: ShowReportEvent) {
        this._reportView!.showReport(event.detail)
    }

    private onClearReport() {
        this._reportView!.clearReport()
    }

    static get styles() {
        // language=CSS
        return css`
        :host {
            height: calc(100% - 2em);
            flex-grow: 1;   
            display: flex;
            flex-direction: column;
            margin-top: 1.5em;
            align-items: center;
            box-sizing: border-box;
        }
        span {
            margin-top: 1em;
            position: absolute;
            right: 1em;
            top: 3em;
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
        <span>prelucrare <em>.XLSX</em> fişiere (de la 2007 format standard al MICROSOFT OFFICE)</span>
        <select-file 
            label="INCARCA FIŞIER..."
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @file-selected="${this.onFileSelected}"
        ></select-file>
        <vaadin-dialog no-close-on-esc no-close-on-outside-click></vaadin-dialog>
        <indications-excel-report-control 
            @indications-excel-show-report="${this.onShowReport}"
            @indications-excel-clear-report="${this.onClearReport}"
        ></indications-excel-report-control>
        <indications-excel-report-view></indications-excel-report-view>
        `
    }

}

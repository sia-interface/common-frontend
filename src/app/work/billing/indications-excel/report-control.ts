import {css, customElement, html, internalProperty, LitElement, query} from "lit-element"

import '@vaadin/vaadin-button'
import '@vaadin/vaadin-select'

import '../../../core/common/components/info-message'
import '../../../core/common/components/vaadin-element-placeholder'
import '../../../core/common/components/vaadin-select-serverside'

import {ENVIRONMENT} from "../../../../environment"
import {RadioIndicationsInfo} from "./model"
import {
    NO_ELEMENT_VALUE,
    VaadinSelectServerside,
    ValueChangedEvent
} from "../../../core/common/components/vaadin-select-serverside"
import {CloseDialogEvent} from "../../../core/common/utils"
import {UserHttpService} from "../../../core/common/services/http-service";

export interface ShowReportRequest {
    reptype: string
    fileid:  string
}

export class ShowReportEvent extends CustomEvent<ShowReportRequest> {
    static eventName = "indications-excel-show-report"

    constructor(detail: ShowReportRequest) {
        super(ShowReportEvent.eventName, { detail, bubbles: true, composed: true})
    }
}

export class ClearReportEvent extends CustomEvent<any> {
    static eventName = "indications-excel-clear-report"

    constructor() {
        super(ClearReportEvent.eventName, { detail: {}, bubbles: true, composed: true})
    }
}

@customElement('indications-excel-report-control')
export class ReportControl extends LitElement {
    static listUrl = ENVIRONMENT.billingServiceUrl + "/indications/excel/list"
    static printUrl = ENVIRONMENT.billingServiceUrl + "/indications/excel/errors/print/"

    static reportTypes = [
        {value: "R", name: "Rînduri eronate" }, // row
        {value: "M", name: "Contoare nu găsite"}, // meter
        {value: "I", name: "Indicaţii necalculate" } // indication
    ]

    @internalProperty() preferredFileID: number = 0
    @internalProperty() selectedReportType: string = ReportControl.reportTypes[0].value

    @internalProperty() private _selectedFileID: string = NO_ELEMENT_VALUE

    @query("#select-file-id") _selectElement?: VaadinSelectServerside<RadioIndicationsInfo>

    static get styles() {
        // language=CSS
        return css`
        :host {
            display: flex;
            flex-flow: column;
        }
        .container {
            display: flex;
            align-items: flex-end;
        }
        .container > * {
            margin-left: 5px;
            margin-right: 5px;
        }
        #select-file-id {
            width: 41em;
        }
        .legend {
            position: absolute;
            display: inline-block;
            width: 22em;
            z-index: 200;
            padding-left: 8px;
            margin: 0 0 3.5em 27.3em;
            background-color: var(--lumo-contrast-5pct);
            font-size: 90%;
        }
        `
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.refresh()
    }

    protected firstUpdated() {
        if (this._selectElement) {
            this._selectElement.renderer = this.fileSelectorRenderer
            this._selectElement.valueExtractor = i => i.id.toString()
        }
    }

    private fileSelectorRenderer = (i: RadioIndicationsInfo) => {
        return html`
        <span style="width: 6em; display: inline-block;">${i.sysdate.substr(0, 10)}</span>
        <span style="width: 13em; display: inline-block;">${i.excelFilename}</span>
        
        <span style="display: inline-block; padding: 0 2px 2px 8px;">
            <iron-icon icon="vaadin:timer" style="height: 16px; width: 16px;"></iron-icon>
        </span>
        <span style="width: 2.5em; display: inline-block; text-align: right; color: gray;">${i.rowsTotal}</span>
        <span style="width: 2.5em; display: inline-block; text-align: right; color: steelblue;">${i.rowsOk}</span>
        <span style="width: 2.5em; display: inline-block; text-align: right; color: green;">${i.meters}</span>
        <span style="width: 2.5em; display: inline-block; text-align: right; color: maroon;">${i.meterReadings}</span>
        `
    }

    public async refresh(event?: Event) {
        if (this._selectElement) {
            let preferredId = -1
            if (event && event instanceof CustomEvent){
                preferredId = (event as CloseDialogEvent<any>).detail.fileid
            }

            this._selectElement.reload(preferredId === -1? undefined : preferredId?.toString())
            this.dispatchEvent(new ClearReportEvent())
        }
    }

    private changeSelectedReport(event: CustomEvent) {
        var newValue = event.detail.value

        if (newValue !== this.selectedReportType) {
            this.selectedReportType = newValue
            this.dispatchEvent(new ClearReportEvent())
        }
    }

    private changeSelectedFileID(event: ValueChangedEvent) {
        var newValue = event.detail

        if (newValue !== this._selectedFileID) {
            this._selectedFileID = newValue
            this.dispatchEvent(new ClearReportEvent())
        }
    }

    private showReport() {
        const fileid = this._selectedFileID??this._selectElement!.value
        const request = {
            reptype: this.selectedReportType,
            fileid
        }
        this.dispatchEvent(new ShowReportEvent(request))
    }

    private async printReport() {
        const fileid = this._selectedFileID??this._selectElement!.value
        await UserHttpService.loadPdfFromUrl(ReportControl.printUrl + fileid, "upload-errors_" + fileid + ".pdf")
    }

    protected render() {
        return html`
        <info-message>RAPOARTE DESPRE FIŞIERE ÎNCĂRCATE</info-message>
        <div class="container">
        <vaadin-button 
                theme="icon" aria-label="refresh"
                @click="${this.refresh}"
        ><iron-icon icon="vaadin:refresh" slot="prefix"></iron-icon></vaadin-button>
        
        <vaadin-select-serverside 
            id="select-file-id"
            label="Data şi fişierul"
            url="${ReportControl.listUrl}"
            notElementsText="Nu există fişiere încărcate"
            @value-changed="${this.changeSelectedFileID}"
        ></vaadin-select-serverside>        
        <span class="legend">
            RÎNDURI:
            <span style="width: 3.2em; display: inline-block; text-align: right; color: gray;">TOT.</span>
            <span style="width: 3.2em; display: inline-block; text-align: right; color: steelblue;">OK.</span>
            <span style="width: 3.3em; display: inline-block; text-align: right; color: green;">CONT.</span>
            <span style="width: 3.3em; display: inline-block; text-align: right; color: maroon;">INDIC.</span>
        </span>
                
        <vaadin-select 
            label="Tipul raportului" 
            value="${this.selectedReportType}"
            @value-changed="${this.changeSelectedReport}"            
        >
            <template>
            <vaadin-list-box>
                ${ ReportControl.reportTypes.map(r => html`<vaadin-item value="${r.value}">${r.name}</vaadin-item>`)}
            </vaadin-list-box>
            </template>
        </vaadin-select>
        <vaadin-button
            theme="icon" aria-label="view"
            @click="${this.showReport}" 
            ?disabled="${this._selectedFileID === '' || this._selectedFileID === NO_ELEMENT_VALUE}"
        ><iron-icon icon="vaadin:desktop" slot="prefix"></iron-icon></vaadin-button>
        <vaadin-button
            theme="icon" aria-label="print-pdf"
            @click="${this.printReport}"
            ?disabled="${this._selectedFileID === '' || this._selectedFileID === NO_ELEMENT_VALUE}"
        ><iron-icon icon="vaadin:print" slot="prefix"></iron-icon></vaadin-button>
        </div>            
        `
    }
}
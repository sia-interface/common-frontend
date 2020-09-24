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
            width: 25em;
        }
        `
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.refresh()
    }

    protected firstUpdated() {
        if (this._selectElement) {
            this._selectElement.renderer = i => html`${i.sysdate.substr(0, 10) + " " + i.excelFilename}`
            this._selectElement.valueExtractor = i => i.id.toString()
        }
    }

    public async refresh(event?: Event) {
        if (this._selectElement) {
            let preferredId = -1
            if (event && event instanceof CustomEvent){
                preferredId = (event as CloseDialogEvent<any>).detail.fileid
            }

            this._selectElement.reload(preferredId === -1? undefined : preferredId.toString())
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
            @click="${this.showReport}" 
            ?disabled="${this._selectedFileID === '' || this._selectedFileID === NO_ELEMENT_VALUE}"
        >VIZUALIZEAZĂ</vaadin-button>
        </div>            
        `
    }
}
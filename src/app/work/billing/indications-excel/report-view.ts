import {css, customElement, html, LitElement, query} from "lit-element"

import '@vaadin/vaadin-grid'
import {GridElement} from "@vaadin/vaadin-grid"

import {ENVIRONMENT} from "../../../../environment"
import {ShowReportRequest} from "./report-control"
import {UserHttpService} from "../../../core/common/services/http-service"
import {RadioIndicationError} from "./model"
import { NOTIFICATION_SERVICE } from "../../../core/internal/services/notification.service"

@customElement('indications-excel-report-view')
export class ReportView extends LitElement {
    static baseURI = ENVIRONMENT.billingServiceUrl + "/indications/excel/errors/"

    @query("vaadin-grid") _vaadinGrid?: GridElement

    protected firstUpdated() {
        const columns = this.shadowRoot!.querySelectorAll('vaadin-grid-column')

        columns[3].renderer = (root, _column, rowData) => {
            const rd = (rowData?.item as any).receiveDate
            root.textContent = rd? (rd as string).substr(0, 10) : ""
        }

        columns[4].renderer = (root, _column, rowData) => {
            const sistema = (rowData?.item as any).sistemaId
            let grupaConsum = ''
            if (sistema) {
                switch (sistema as number) {
                    case 1: grupaConsum = 'Apartamente'; break
                    case 2: grupaConsum = 'Sector Particular'; break
                    case 3: grupaConsum = 'Agenţii Economici'; break;
                }
            }
            root.textContent = grupaConsum
        }

    }

    public clearReport() {
        this._vaadinGrid!.style.display = 'none'
        this._vaadinGrid!.items = []
    }

    public async showReport(r: ShowReportRequest) {
        try {
            const url = ReportView.baseURI + r.reptype + "/" + r.fileid
            const reportData = await UserHttpService.get<RadioIndicationError[]>(url, {})
            this._vaadinGrid!.items = reportData

            if (reportData.length == 0) {
                this._vaadinGrid!.style.display = 'none'
                NOTIFICATION_SERVICE.notificate('info','Nu sunt date pentru vizualizare')
            } else {
                this._vaadinGrid!.style.display = 'block'
            }
        } catch (ex) {
            this._vaadinGrid!.style.display = 'none'
            this._vaadinGrid!.items = []
        }
    }

    static get styles() {
        // language=CSS
        return css`
            :host {
                width: 100%;
            }
            vaadin-grid {
                margin: 1em;
                height: calc(100% - 1.1em);
                box-sizing: border-box;
            }
        `
    }

    protected render() {
        return html`
        <vaadin-grid>
            <vaadin-grid-column width="5em" flex-grow="0" path="rowIndex" header="Nr"></vaadin-grid-column>
            <vaadin-grid-column width="8em" flex-grow="0" path="meterNumber" header="Nr Contor"></vaadin-grid-column>
            <vaadin-grid-column width="6em" flex-grow="0" text-align="end" path="meterReadings" header="Indicaţii"></vaadin-grid-column>
            <vaadin-grid-column width="8em" flex-grow="0" path="receiveDate" header="Data"></vaadin-grid-column>
            
            <vaadin-grid-column width="10em" flex-grow="0" path="sistemaId" header="Grupa consum"></vaadin-grid-column>
            <vaadin-grid-column width="7em" flex-grow="0" path="nrContract" header="Nr contract"></vaadin-grid-column>
            <vaadin-grid-column flex-grow="2" path="address" header="Adresa"></vaadin-grid-column>
            
            <vaadin-grid-column path="errorText" header="Eroare"></vaadin-grid-column>
        </vaadin-grid>
        `
    }
}

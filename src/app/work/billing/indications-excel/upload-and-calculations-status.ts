import {css, customElement, html, internalProperty, LitElement, property} from "lit-element"

import '@vaadin/vaadin-button'
import '@vaadin/vaadin-progress-bar'

import '../../../core/common/components/info-message'
import '../../../core/common/components/info-panel'

import {CalculationStatus, UploadResult} from "./model"
import {ElementAlign} from "../../../core/common/components/info-panel"
import {ENVIRONMENT} from "../../../../environment";
import {CloseDialogEvent, later} from "../../../core/common/utils";
import {UserHttpService} from "../../../core/common/services/http-service"

@customElement('upload-and-calculations-status')
export class UploadAndCalculationsStatus extends LitElement {
    @property({type: Object}) uploadResult?: UploadResult

    @internalProperty() jobRunning: boolean = false
    @internalProperty() calculationStatus?: CalculationStatus

    static get styles() {
        // language=CSS
        return css`
        div {
            font-weight: bold;
        }
        info-panel {
            min-width: 40em;
        }
        .buttons-bar {
            margin-top: 1em;
            display: flex;
            justify-content: flex-end;
        }
        .progress-bar {
            margin-top: 1em;
            color: darkgray;
        }
        .buttons-bar vaadin-button {
            margin-left: 1em;
        }
        `
    }

    connectedCallback() {
        super.connectedCallback();

        this.calculationStatus = undefined
        if (this.uploadResult) {
            const result = this.uploadResult
            this.loadAndShowCalcStatus(result.fileID)
        }
    }

    async loadAndShowCalcStatus(fileID: number) {
        this.jobRunning = true
        while (this.jobRunning) {
            try {
                let status = await UserHttpService.get<CalculationStatus>(ENVIRONMENT.billingServiceUrl + "/indications/excel/status/" + fileID, {})
                if (!status.jobRunning) {
                    this.jobRunning = false
                }
                this.calculationStatus = status
            } catch (ex) {
            }
            if (this.jobRunning) {
                await later(2000)
            }
        }
    }

    private closeDialog() {
        this.dispatchEvent(new CloseDialogEvent({ fileid: this.uploadResult?.fileID }));
    }

    render() {
        if (this.uploadResult) {
            const result = this.uploadResult
            return html`
            ${ this.renderStats(result) }
            ${ this.jobRunning? this.renderJobRunning() : this.renderCalculationStatus() }            
            `
        } else {
            return html`<info-message>informațiile despre excel fişier nu sunt disponibila</info-message>`
        }
    }

    private renderStats(result: UploadResult) {
        const elements = [
            {header: "rînduri totale", content: result.processedRows.toString(), align: 'right' as ElementAlign },
            {header: "rînduri corecte", content: result.okRows.toString(), align: 'right' as ElementAlign },
            {header: "rînduri greşite", content: result.errorRows.toString(), align: 'right' as ElementAlign },
            {header: "rînduri goale", content: result.emptyRows.toString(), align: 'right' as ElementAlign },
        ]
        return html`
        <info-panel header="STATISTICA GENERALA" .elements="${elements}"></info-panel>
        `
    }

    private renderJobRunning() {
        return html`
            <div class="progress-bar">
            ${this.calculationStatus && this.calculationStatus.searchCompleted ? "calculare a indicaţiilor" : "căutare a contoarelor"  }
            <vaadin-progress-bar indeterminate value="0"></vaadin-progress-bar>
            </div>            
        `
    }

    private renderCalculationStatus() {
        if (this.calculationStatus) {
            const status = this.calculationStatus
            const elements = [
                {header: "contoare căutate", content: status.metersFoundRows.toString(), align: 'right' as ElementAlign },
                {header: "indicaţii procesate", content: status.calculatedRows.toString(), align: 'right' as ElementAlign },
            ]
            return html`
            <info-panel header="INFORMAŢIE DESPRE CALCUL" .elements="${elements}"></info-panel>
            <div class="buttons-bar">
                <vaadin-button @click="${this.closeDialog}">ÎNCHIDE</vaadin-button>
            </div>            
            `
        } else {
            return html``
        }
    }
}
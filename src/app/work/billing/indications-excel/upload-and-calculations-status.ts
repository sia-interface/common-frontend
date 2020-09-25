import {css, customElement, html, internalProperty, LitElement} from "lit-element"

import '@vaadin/vaadin-button'
import '@vaadin/vaadin-progress-bar'

import '../../../core/common/components/info-message'
import '../../../core/common/components/info-panel'

import {CalculationStatus, UploadResult} from "./model"
import {ElementAlign} from "../../../core/common/components/info-panel"
import {ENVIRONMENT} from "../../../../environment";
import {CloseDialogEvent, later} from "../../../core/common/utils"
import {UserHttpService} from "../../../core/common/services/http-service"

@customElement('upload-and-calculations-status')
export class UploadAndCalculationsStatus extends LitElement {
    static uploadTarget = ENVIRONMENT.billingServiceUrl + "/indications/excel/upload"

    @internalProperty() uploadResult?: UploadResult
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
            padding: 2em 4em;
            color: darkgray;
        }
        vaadin-progress-bar {
            width: 20em;
        }
        .buttons-bar vaadin-button {
            margin-left: 1em;
        }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.jobRunning = true
        this.calculationStatus = undefined
    }

    public async loadAndShowCalcStatus(file: File) {
        const formData: FormData = new FormData()
        formData.append('file', file)

        try {
            const uploadUrl = UploadAndCalculationsStatus.uploadTarget
            const result = await UserHttpService.post<UploadResult>(uploadUrl, { body: formData, contentType: 'multipart'})
            this.uploadResult = result

            const fileID = result.fileID

            while (this.jobRunning) {
                let status = await UserHttpService.get<CalculationStatus>(ENVIRONMENT.billingServiceUrl + "/indications/excel/status/" + fileID, {})
                if (!status.jobRunning) {
                    this.jobRunning = false
                }
                this.calculationStatus = status
                if (this.jobRunning) {
                    await later(1000)
                }
            }
        } catch (ex) {
            // TODO: show error message
            this.jobRunning = false
        }
    }

    private closeDialog() {
        this.dispatchEvent(new CloseDialogEvent({ fileid: this.uploadResult?.fileID }));
    }

    render() {
        if (this.jobRunning) {
            return this.renderJobRunning()
        } else if (this.uploadResult) {
            const result = this.uploadResult
            return html`
            <info-message>încărcarea și prelucrarea datelor finalizate</info-message>
            ${ this.renderStats(result) }
            ${ this.renderCalculationStatus() }            
            `
        } else {
            return html`
            <info-message>informațiile despre excel fişier nu sunt disponibila</info-message>
            <vaadin-button @click="${this.closeDialog}">ÎNCHIDE</vaadin-button>
            `
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
            ${ this.calculationStatus? 
                (this.calculationStatus.searchCompleted ? 
                    "calculare a indicaţiilor; calculate: " + this.calculationStatus.calculatedRowsCurrent : 
                    "căutare a contoarelor") : "încărcarea fişierului"  }
            <vaadin-progress-bar indeterminate value="0"></vaadin-progress-bar>
            </div>            
        `
    }

    private renderCalculationStatus() {
        if (this.calculationStatus) {
            const status = this.calculationStatus
            const elements = [
                {header: "contoare căutate", content: status.metersFoundRows.toString(), align: 'right' as ElementAlign },
                {header: "indicaţii procesate", content: status.calculatedRowsTotal.toString(), align: 'right' as ElementAlign },
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
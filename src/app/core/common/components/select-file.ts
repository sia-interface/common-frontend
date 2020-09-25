import {customElement, html, LitElement, property, query} from "lit-element"

export class FileSelectedEvent extends CustomEvent<File> {
    static eventName = "file-selected"

    constructor(detail: File) {
        super(FileSelectedEvent.eventName, { detail, bubbles: true, composed: true})
    }
}

@customElement('select-file')
export class SelectFile extends LitElement {
    @property({ type: String }) accept: string = ''
    @property({ type: String }) label: string = 'UPLOAD FILE...'
    @property({ type: Boolean }) disabled: boolean = false

    @query("#fileInput") _uploadElement?: HTMLInputElement

    private onUploadFile = (event: Event) => {
        let files = (event.target as any).files as FileList
        if (!files) {
            return
        }
        if (files.length > 0) {
            const file = files[0]
            this.dispatchEvent(new FileSelectedEvent(file))
        }
        (event.target as any).value = ""
    }

    private onClickUpload = () => {
        this._uploadElement!.click()
    }

    render() {
        return html`
        <vaadin-button ?disabled="${this.disabled}" @click="${this.onClickUpload}">
            <iron-icon icon="vaadin:download-alt" slot="prefix"></iron-icon>
            ${this.label}
        </vaadin-button>
        <input type="file" id="fileInput" @change="${this.onUploadFile}" hidden accept="${this.accept}">
        `
    }
}
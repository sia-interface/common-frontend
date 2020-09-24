import {
    customElement,
    html,
    LitElement,
    property,
    PropertyValues,
    query,
    TemplateResult
} from "lit-element"

import { render as renderTemplate } from 'lit-html'

import '@vaadin/vaadin-select'
import {SelectElement} from "@vaadin/vaadin-select"

import {UserHttpService} from "../services/http-service"

@customElement('vaadin-select-serverside')
export class VaadinSelectServerside<T> extends LitElement {
    @property({ type: String }) url: string = ''

    @property({type: String}) label: string = ''
    @property({ type: String }) notReadyText: string = ''
    @property({ type: String }) notElementsText: string = '--default-element--'

    private _renderer?: (item: T) => TemplateResult
    private _valueExtractor?: (item: T) => string

    @query("vaadin-select") _selectElement?: SelectElement

    private _loadedValues?: T[]
    private _needRerender = false
    private _selectedValue: string = ''

    public get value(): string {
        return this._selectedValue
    }

    public set renderer(v: (item: T) => TemplateResult) {
        this._renderer = v
    }

    public set valueExtractor(v: (item: T) => string) {
        this._valueExtractor = v
    }

    protected async firstUpdated(changedProperties: PropertyValues) {
        if (changedProperties.has('url')) {
            await this.reload()
        }
    }

    private changeSelectedValue(event: CustomEvent) {
        this._selectedValue = event.detail.value
    }

    public async reload(selectedValue?: string) {
        this._needRerender = true
        try {
            this._loadedValues = await UserHttpService.get<T[]>(this.url, {})
        } catch (ex) {
            this._loadedValues = undefined
        }
        if (this._selectElement && this._renderer) {
            this._selectElement.renderer = (root, select) => {
                this.renderVaadinSelect(root, select!, selectedValue)
            }
        }
    }

    private renderVaadinSelect = (root: HTMLElement, select: SelectElement, preferredValue?: string) => {
        // Check if there is a list-box generated with the previous renderer call
        // to update its content instead of recreation
        if (root.firstChild && !this._needRerender) {
            return;
        }

        if (root.firstChild) root.firstChild.remove()

        if (this._loadedValues && this._loadedValues.length > 0 && this._renderer) {
            let selectedValue: string
            const listBox = window.document.createElement('vaadin-list-box')

            this._loadedValues.forEach(item => {
                const vaadinItem = window.document.createElement('vaadin-item')

                const template = this._renderer!(item)
                renderTemplate(template, vaadinItem)
                if (this._valueExtractor) {
                    const value = this._valueExtractor(item)
                    vaadinItem.setAttribute('value', value)

                    if (!selectedValue) {
                        if (preferredValue) {
                            if (preferredValue === value) selectedValue = value
                        } else {
                            selectedValue = value
                        }
                    }
                }

                listBox.appendChild(vaadinItem)
            })
            root.appendChild(listBox)

            select.setAttribute('value', selectedValue!)
            select.disabled = false
            this._needRerender = false
        } else {
            const listBox = window.document.createElement('vaadin-list-box')
            const vaadinItem = window.document.createElement('vaadin-item')
            vaadinItem.textContent = this.notElementsText
            vaadinItem.setAttribute('value', 'I')
            listBox.appendChild(vaadinItem)
            root.appendChild(listBox)

            select.setAttribute('value', 'I')
            select.disabled = true

            if (this._renderer) {
                this._needRerender = false
            }
        }
    }

    protected render() {
        return html`
        <vaadin-select 
            label="${this.label}" 
            style="width: 100%"
            @value-changed="${this.changeSelectedValue}"
        ></vaadin-select>
        `
    }
}
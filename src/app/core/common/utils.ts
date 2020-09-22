
// execute something after delay (milliseconds)
export function later(delay: number) {
    return new Promise(function (resolve) {
        window.setTimeout(resolve, delay)
    })
}

export class CloseDialogEvent<T> extends CustomEvent<T> {
    static eventName = "close-vaadin-dialog"

    constructor(detail: T) {
        super(CloseDialogEvent.eventName, { detail, bubbles: true, composed: true})
    }
}

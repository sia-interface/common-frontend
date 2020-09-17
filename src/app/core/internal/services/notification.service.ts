export type MessageSeverity = 'error' | 'info'

export interface NotificationMessage {
    severity: MessageSeverity
    text: string
}

export class NotificationEvent extends CustomEvent<NotificationMessage> {
    static eventName = "sia-notification-fired"

    constructor(detail: NotificationMessage) {
        super(NotificationEvent.eventName, { detail, bubbles: true, composed: true})
    }
}

export class NotificationService {
    public notificate(severity: MessageSeverity, text: string) {
        const message = {severity, text}
        window.dispatchEvent(new NotificationEvent(message))
    }
}

export const NOTIFICATION_SERVICE = new NotificationService()
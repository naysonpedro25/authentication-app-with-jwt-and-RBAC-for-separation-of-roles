export class UnableSendEmailError extends Error {
    constructor() {
        super('Unable to send email');
    }
}

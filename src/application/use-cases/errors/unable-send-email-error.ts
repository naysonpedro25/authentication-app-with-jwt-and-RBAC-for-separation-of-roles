export class UnableSendEmailError extends Error {
    constructor() {
        super('Could not send email, please check if it actually exists.');
    }
}

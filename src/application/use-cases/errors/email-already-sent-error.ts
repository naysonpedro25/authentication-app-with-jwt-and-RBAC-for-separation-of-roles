export class EmailAlreadySentError extends Error {
    constructor() {
        super('E-mail already sent');
    }
}

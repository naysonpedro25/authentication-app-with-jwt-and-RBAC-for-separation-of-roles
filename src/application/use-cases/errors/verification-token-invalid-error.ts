export class VerificationTokenInvalidError extends Error {
    constructor() {
        super('Invalid or expired verification token ');
    }
}

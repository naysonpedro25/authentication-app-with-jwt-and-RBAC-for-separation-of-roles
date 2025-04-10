export class VerificationTokenExpiredError extends Error {
    constructor() {
        super('Verification Token Expired');
    }
}

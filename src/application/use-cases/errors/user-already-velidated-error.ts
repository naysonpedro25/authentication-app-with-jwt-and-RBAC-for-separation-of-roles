export class UserAlreadyValidatedError extends Error {
    constructor() {
        super('User already validated');
    }
}

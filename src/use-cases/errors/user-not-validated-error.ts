export class UserNotValidatedError extends Error {
    constructor() {
        super('User not validated');
    }
}

export class UnableDeleteUserLogged extends Error {
    constructor() {
        super('Resource not found');
    }
}

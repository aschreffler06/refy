export class UserNotInGuildError extends Error {
    constructor(name: string) {
        super(`User ${name} not found in server. Please have them join first and try again.`);
    }
}

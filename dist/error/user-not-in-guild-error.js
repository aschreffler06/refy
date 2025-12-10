export class UserNotInGuildError extends Error {
    constructor(name) {
        super(`User id ${name} not found in server. Please have them join first and try again.`);
    }
}
//# sourceMappingURL=user-not-in-guild-error.js.map
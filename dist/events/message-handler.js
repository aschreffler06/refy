export class MessageHandler {
    constructor(triggerHandler) {
        this.triggerHandler = triggerHandler;
    }
    async process(msg) {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user?.id) {
            return;
        }
        // Process trigger
        await this.triggerHandler.process(msg);
    }
}
//# sourceMappingURL=message-handler.js.map
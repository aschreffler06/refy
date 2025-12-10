import { Client } from 'discord.js';
export class CustomClient extends Client {
    constructor(clientOptions) {
        super(clientOptions);
    }
    setPresence(type, name, url) {
        return this.user?.setPresence({
            activities: [
                {
                    type,
                    name,
                    url,
                },
            ],
        });
    }
}
//# sourceMappingURL=custom-client.js.map
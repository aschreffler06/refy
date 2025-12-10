import { Channel, CommandInteractionOptionResolver, Guild, PartialDMChannel, User } from 'discord.js';
import { EventData } from '../models/internal-models.js';
export declare class EventDataService {
    create(options?: {
        user?: User;
        channel?: Channel | PartialDMChannel;
        guild?: Guild;
        args?: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>;
    }): Promise<EventData>;
}

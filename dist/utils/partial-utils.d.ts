import { Message, MessageReaction, PartialMessage, PartialMessageReaction, PartialUser, User } from 'discord.js';
export declare class PartialUtils {
    static fillUser(user: User | PartialUser): Promise<User>;
    static fillMessage(msg: Message | PartialMessage): Promise<Message>;
    static fillReaction(msgReaction: MessageReaction | PartialMessageReaction): Promise<MessageReaction>;
}

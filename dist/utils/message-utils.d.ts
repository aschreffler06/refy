import { BaseMessageOptions, EmbedBuilder, EmojiResolvable, Message, MessageEditOptions, MessageReaction, StartThreadOptions, TextBasedChannel, ThreadChannel, User } from 'discord.js';
export declare class MessageUtils {
    static send(target: User | TextBasedChannel, content: string | EmbedBuilder | BaseMessageOptions): Promise<Message>;
    static reply(msg: Message, content: string | EmbedBuilder | BaseMessageOptions): Promise<Message>;
    static edit(msg: Message, content: string | EmbedBuilder | MessageEditOptions): Promise<Message>;
    static react(msg: Message, emoji: EmojiResolvable): Promise<MessageReaction>;
    static pin(msg: Message, pinned?: boolean): Promise<Message>;
    static startThread(msg: Message, options: StartThreadOptions): Promise<ThreadChannel>;
    static delete(msg: Message): Promise<Message>;
}

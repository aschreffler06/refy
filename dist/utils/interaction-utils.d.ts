import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, CommandInteraction, EmbedBuilder, InteractionReplyOptions, InteractionResponse, InteractionUpdateOptions, Message, MessageComponentInteraction, ModalSubmitInteraction, WebhookMessageEditOptions } from 'discord.js';
export declare class InteractionUtils {
    static deferReply(intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, hidden?: boolean): Promise<InteractionResponse>;
    static deferUpdate(intr: MessageComponentInteraction | ModalSubmitInteraction): Promise<InteractionResponse>;
    static send(intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, content: string | EmbedBuilder | InteractionReplyOptions, hidden?: boolean): Promise<Message>;
    static respond(intr: AutocompleteInteraction, choices?: ApplicationCommandOptionChoiceData[]): Promise<void>;
    static editReply(intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, content: string | EmbedBuilder | WebhookMessageEditOptions): Promise<Message>;
    static update(intr: MessageComponentInteraction, content: string | EmbedBuilder | InteractionUpdateOptions): Promise<Message>;
}

/**
 * Testing for the AuctionSetupCommand
 */

import { AuctionSetupCommand } from '../../../src/commands/chat/auction-setup-command';
import { ChatInputCommandInteraction } from 'discord.js';
import { DatabaseUtils } from '../../../src/utils/index';
import { EventData } from '../../../src/models/internal-models';

describe('AuctionSetupCommand', () => {
    let command: AuctionSetupCommand;
    let interaction: ChatInputCommandInteraction;
    let data: EventData;

    beforeEach(() => {
        DatabaseUtils.connectDBForTesting();
    });

    afterEach(() => {
        DatabaseUtils.disconnectDBForTesting();
    });

    it('should throw an InvalidDiscordTagError', () => {
        command.execute(interaction, data);
    });
});

import { REST } from '@discordjs/rest';
import { Options, Partials } from 'discord.js';
import { createRequire } from 'node:module';
import { 
// AuctionBalanceCommand,
// AuctionDisplayCommand,
// AuctionSaleCommand,
// AuctionSetupCommand,
// AuctionStartCommand,
// AuctionTeamCommand,
// CreateTicketCommand,
// HelpCommand,
// InfoCommand,
LinkCommand, PpBountyScoresCommand, PpCreateBountyCommand, PpCreateLeaderboardCommand, PpCreateMatchCommand, PpCreateTeamCommand, PpDisplayCommand, PpDisplayTotalCommand, PpGetScoreCommand, PpJoinTeamCommand, PpSetUpdatesChannelCommand, PpSubmitBountyCommand, PpSubmitPlayCommand, PpToggleSnipeNotifyCommand, PpUserStatsCommand, TestCommand, } from './commands/chat/index.js';
import { ChatCommandMetadata, MessageCommandMetadata, UserCommandMetadata, } from './commands/index.js';
import { ViewDateSent } from './commands/message/index.js';
import { ViewDateJoined } from './commands/user/index.js';
// import { OsuController } from './controllers/index.js';
import { ButtonHandler, CommandHandler, GuildJoinHandler, GuildLeaveHandler, MessageHandler, ReactionHandler, TriggerHandler, } from './events/index.js';
import { CustomClient } from './extensions/index.js';
// import { Api } from './models/api.js';
import { Bot } from './models/bot.js';
import { CommandRegistrationService, EventDataService, JobService, Logger, } from './services/index.js';
import { DatabaseUtils } from './utils/index.js';
const require = createRequire(import.meta.url);
let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');
async function start() {
    // Services
    let eventDataService = new EventDataService();
    // Database
    await DatabaseUtils.connectDB();
    // Client
    let client = new CustomClient({
        intents: Config.client.intents,
        partials: Config.client.partials.map(partial => Partials[partial]),
        makeCache: Options.cacheWithLimits({
            // Keep default caching behavior
            ...Options.DefaultMakeCacheSettings,
            // Override specific options from config
            ...Config.client.caches,
        }),
    });
    // Commands
    let commands = [
        // Chat Commands
        // new HelpCommand(),
        // new InfoCommand(),
        new TestCommand(),
        // new AuctionBalanceCommand(),
        // new AuctionDisplayCommand(),
        // new AuctionSaleCommand(),
        // new AuctionSetupCommand(),
        // new AuctionStartCommand(),
        // new AuctionTeamCommand(),
        // new CreateTicketCommand(),
        new LinkCommand(),
        new PpBountyScoresCommand(),
        new PpCreateBountyCommand(),
        new PpCreateLeaderboardCommand(),
        new PpCreateMatchCommand(),
        new PpCreateTeamCommand(),
        new PpDisplayCommand(),
        new PpDisplayTotalCommand(),
        new PpGetScoreCommand(),
        new PpJoinTeamCommand(),
        new PpSetUpdatesChannelCommand(),
        new PpSubmitBountyCommand(),
        new PpSubmitPlayCommand(),
        new PpToggleSnipeNotifyCommand(),
        new PpUserStatsCommand(),
        // Message Context Commands
        new ViewDateSent(),
        // User Context Commands
        new ViewDateJoined(),
        // TODO: Add new commands here
    ];
    // Buttons
    let buttons = [
    // TODO: Add new buttons here
    ];
    // Reactions
    let reactions = [
    // TODO: Add new reactions here
    ];
    // Triggers
    let triggers = [
    // TODO: Add new triggers here
    ];
    // Event handlers
    let guildJoinHandler = new GuildJoinHandler(eventDataService);
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler(commands, eventDataService);
    let buttonHandler = new ButtonHandler(buttons, eventDataService);
    let triggerHandler = new TriggerHandler(triggers, eventDataService);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler(reactions, eventDataService);
    // Jobs
    let jobs = [
    // TODO: Add new jobs here
    ];
    // Bot
    let bot = new Bot(Config.client.token, client, guildJoinHandler, guildLeaveHandler, messageHandler, commandHandler, buttonHandler, reactionHandler, new JobService(jobs));
    // Register
    if (process.argv[2] == 'commands') {
        try {
            let rest = new REST({ version: '10' }).setToken(Config.client.token);
            let commandRegistrationService = new CommandRegistrationService(rest);
            let localCmds = [
                ...Object.values(ChatCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(MessageCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(UserCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
            ];
            await commandRegistrationService.process(localCmds, process.argv);
        }
        catch (error) {
            Logger.error(Logs.error.commandAction, error);
        }
        // Wait for any final logs to be written.
        await new Promise(resolve => setTimeout(resolve, 1000));
        process.exit();
    }
    //test api stuff
    // let osuController = new OsuController();
    // let api = new Api([osuController]);
    // await api.start();
    await bot.start();
}
process.on('unhandledRejection', (reason, _promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});
start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
//# sourceMappingURL=start-bot.js.map
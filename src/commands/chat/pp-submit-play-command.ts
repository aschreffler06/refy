import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuController } from '../../controllers/osu-controller.js';
import { OsuScore } from '../../models/data-objects/index.js';
import { Player } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpSubmitPlayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppSubmitPlay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    //TODO: make it so you can submit a score id as well
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
        };
        const osuController = new OsuController();
        const recentPlays = await osuController.getRecentPlays(intr.user.id);
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        let playEmbed = new EmbedBuilder().setTitle('Submitted Play').setAuthor({
            name: player.username,
            iconURL: player.avatar,
            url: `https://osu.ppy.sh/users/${player._id}`,
        });
        let play: OsuScore;
        if (!args.recent) {
            play = recentPlays[0];
        } else if (args.recent <= recentPlays.length) {
            play = recentPlays[args.recent - 1];
        } else {
            await InteractionUtils.send(
                intr,
                `You don't have that many recent plays! (Does not include fails)`
            );
        }
        //TODO: Check id and then put in db
        playEmbed
            .addFields({
                name: `${play.title} [${play.version}] **${play.mods.join('')}**`,
                value: `Worth ${play.pp.toFixed(2)} pp!`,
            })
            .setThumbnail(play.list);
        await InteractionUtils.send(intr, playEmbed);
    }
}

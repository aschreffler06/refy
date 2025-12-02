import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuService } from '../../services/index.js';
import { OsuUserInfoDTO } from '../../models/data-objects/index.js';
import { Player } from '../../models/database/player.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class LinkCommand implements Command {
    public names = [Lang.getRef('chatCommands.link', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    //TODO: make work with old names. api user data should send it back to us
    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };

        const osuService = new OsuService();
        const userInfo: OsuUserInfoDTO = await osuService.getUser({
            username: args.name,
        });

        const discordId = intr.user.id;

        const user = await Player.findById(userInfo.id).exec();
        if (!user) {
            const player = new Player({
                _id: userInfo.id,
                username: userInfo.username,
                discord: discordId,
                rank: userInfo.rank,
                badges: userInfo.badges,
                accuracy: userInfo.accuracy,
                level: userInfo.level,
                playCount: userInfo.playCount,
                playTime: userInfo.playTime,
                avatar: userInfo.avatar,
            });
            await player.save();
            await InteractionUtils.send(intr, {
                content: `You have successfully linked your account!`,
                ephemeral: true,
            });
        } else {
            user._id = userInfo.id;
            user.username = userInfo.username;
            user.discord = discordId;
            user.rank = userInfo.rank;
            user.badges = userInfo.badges;
            user.accuracy = userInfo.accuracy;
            user.level = userInfo.level;
            user.playCount = userInfo.playCount;
            user.playTime = userInfo.playTime;
            user.avatar = userInfo.avatar;
            await user.save();
            await InteractionUtils.send(intr, {
                content: `You have successfully relinked your account!`,
                ephemeral: true,
            });
        }
    }
}

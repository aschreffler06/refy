import { RateLimiter } from 'discord.js-rate-limiter';
import { Player } from '../../models/database/player.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang, OsuService } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class LinkCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.link', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    //TODO: make work with old names. api user data should send it back to us
    async execute(intr, _data) {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };
        const osuService = new OsuService();
        const userInfo = await osuService.getUser({
            username: args.name,
        });
        const allRanks = await osuService.getUserAllModes({
            username: args.name,
        });
        console.log(allRanks);
        const discordId = intr.user.id;
        const user = await Player.findById(userInfo.id).exec();
        if (!user) {
            const player = new Player({
                _id: userInfo.id,
                username: userInfo.username,
                discord: discordId,
                rank: allRanks.osu,
                rankTaiko: allRanks.taiko,
                rankCatch: allRanks.fruits,
                rankMania: allRanks.mania,
                badges: userInfo.badges,
                accuracy: userInfo.accuracy,
                level: userInfo.level,
                playCount: userInfo.playCount,
                playTime: userInfo.playTime,
                avatar: userInfo.avatar,
                notifyOnSnipe: false,
            });
            await player.save();
            await InteractionUtils.send(intr, {
                content: `You have successfully linked your account!`,
                ephemeral: true,
            });
        }
        else {
            user._id = userInfo.id;
            user.username = userInfo.username;
            user.discord = discordId;
            if (user.rank == null) {
                user.rank = allRanks.osu;
            }
            if (user.rankTaiko == null) {
                user.rankTaiko = allRanks.taiko;
            }
            if (user.rankCatch == null) {
                user.rankCatch = allRanks.fruits;
            }
            if (user.rankMania == null) {
                user.rankMania = allRanks.mania;
            }
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
//# sourceMappingURL=link-command.js.map
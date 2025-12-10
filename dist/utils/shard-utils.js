import { fetchRecommendedShardCount, ShardClientUtil, ShardingManager } from 'discord.js';
import { DiscordLimits } from '../constants/index.js';
import { MathUtils } from './index.js';
export class ShardUtils {
    static async requiredShardCount(token) {
        return await this.recommendedShardCount(token, DiscordLimits.GUILDS_PER_SHARD);
    }
    static async recommendedShardCount(token, serversPerShard) {
        return Math.ceil(await fetchRecommendedShardCount(token, { guildsPerShard: serversPerShard }));
    }
    static shardIds(shardInterface) {
        if (shardInterface instanceof ShardingManager) {
            return shardInterface.shards.map(shard => shard.id);
        }
        else if (shardInterface instanceof ShardClientUtil) {
            return shardInterface.ids;
        }
    }
    static shardId(guildId, shardCount) {
        // See sharding formula:
        //   https://discord.com/developers/docs/topics/gateway#sharding-sharding-formula
        // tslint:disable-next-line:no-bitwise
        return Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
    }
    static async serverCount(shardInterface) {
        let shardGuildCounts = (await shardInterface.fetchClientValues('guilds.cache.size'));
        return MathUtils.sum(shardGuildCounts);
    }
}
//# sourceMappingURL=shard-utils.js.map
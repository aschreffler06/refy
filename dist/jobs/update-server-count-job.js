import { ActivityType } from 'discord.js';
import { createRequire } from 'node:module';
import { Lang, Logger } from '../services/index.js';
import { ShardUtils } from '../utils/index.js';
const require = createRequire(import.meta.url);
let BotSites = require('../../config/bot-sites.json');
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');
export class UpdateServerCountJob {
    constructor(shardManager, httpService) {
        this.shardManager = shardManager;
        this.httpService = httpService;
        this.name = 'Update Server Count';
        this.schedule = Config.jobs.updateServerCount.schedule;
        this.log = Config.jobs.updateServerCount.log;
        this.botSites = BotSites.filter(botSite => botSite.enabled);
    }
    async run() {
        let serverCount = await ShardUtils.serverCount(this.shardManager);
        let type = ActivityType.Streaming;
        let name = `to ${serverCount.toLocaleString()} servers`;
        let url = Lang.getCom('links.stream');
        await this.shardManager.broadcastEval((client, context) => {
            return client.setPresence(context.type, context.name, context.url);
        }, { context: { type, name, url } });
        Logger.info(Logs.info.updatedServerCount.replaceAll('{SERVER_COUNT}', serverCount.toLocaleString()));
        for (let botSite of this.botSites) {
            try {
                let body = JSON.parse(botSite.body.replaceAll('{{SERVER_COUNT}}', serverCount.toString()));
                let res = await this.httpService.post(botSite.url, botSite.authorization, body);
                if (!res.ok) {
                    throw res;
                }
            }
            catch (error) {
                Logger.error(Logs.error.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name), error);
                continue;
            }
            Logger.info(Logs.info.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name));
        }
    }
}
//# sourceMappingURL=update-server-count-job.js.map
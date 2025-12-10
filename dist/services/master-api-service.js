import { createRequire } from 'node:module';
import { URL } from 'node:url';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class MasterApiService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async register() {
        let reqBody = {
            shardCount: Config.clustering.shardCount,
            callback: {
                url: Config.clustering.callbackUrl,
                token: Config.api.secret,
            },
        };
        let res = await this.httpService.post(new URL('/clusters', Config.clustering.masterApi.url), Config.clustering.masterApi.token, reqBody);
        if (!res.ok) {
            throw res;
        }
        let resBody = (await res.json());
        this.clusterId = resBody.id;
    }
    async login() {
        let res = await this.httpService.put(new URL(`/clusters/${this.clusterId}/login`, Config.clustering.masterApi.url), Config.clustering.masterApi.token);
        if (!res.ok) {
            throw res;
        }
        return (await res.json());
    }
    async ready() {
        let res = await this.httpService.put(new URL(`/clusters/${this.clusterId}/ready`, Config.clustering.masterApi.url), Config.clustering.masterApi.token);
        if (!res.ok) {
            throw res;
        }
    }
}
//# sourceMappingURL=master-api-service.js.map
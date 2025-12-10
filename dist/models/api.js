import express from 'express';
import { createRequire } from 'node:module';
import util from 'node:util';
import { checkAuth, handleError } from '../middleware/index.js';
import { Logger } from '../services/index.js';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');
export class Api {
    constructor(controllers) {
        this.controllers = controllers;
        this.app = express();
        this.app.use(express.json());
        this.setupControllers();
        this.app.use(handleError());
    }
    async start() {
        let listen = util.promisify(this.app.listen.bind(this.app));
        await listen(Config.api.port);
        Logger.info(Logs.info.apiStarted.replaceAll('{PORT}', Config.api.port));
    }
    setupControllers() {
        for (let controller of this.controllers) {
            if (controller.authToken) {
                controller.router.use(checkAuth(controller.authToken));
            }
            controller.register();
            this.app.use(controller.path, controller.router);
        }
    }
}
//# sourceMappingURL=api.js.map
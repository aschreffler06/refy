import { Controller } from '../controllers/index.js';
export declare class Api {
    controllers: Controller[];
    private app;
    constructor(controllers: Controller[]);
    start(): Promise<void>;
    private setupControllers;
}

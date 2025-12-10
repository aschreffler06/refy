import { Router } from 'express';
import { Controller } from './index.js';
export declare class RootController implements Controller {
    path: string;
    router: Router;
    register(): void;
    private get;
}

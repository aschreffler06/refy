import { Job } from '../jobs/index.js';
export declare class JobService {
    private jobs;
    constructor(jobs: Job[]);
    start(): void;
}

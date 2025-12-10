import { LoginClusterResponse } from '../models/master-api/index.js';
import { HttpService } from './index.js';
export declare class MasterApiService {
    private httpService;
    private clusterId;
    constructor(httpService: HttpService);
    register(): Promise<void>;
    login(): Promise<LoginClusterResponse>;
    ready(): Promise<void>;
}

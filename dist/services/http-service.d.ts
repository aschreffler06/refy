/// <reference types="node" />
import { Response } from 'node-fetch';
import { URL } from 'node:url';
export declare class HttpService {
    get(url: string | URL, authorization: string): Promise<Response>;
    post(url: string | URL, authorization: string, body?: object): Promise<Response>;
    put(url: string | URL, authorization: string, body?: object): Promise<Response>;
    delete(url: string | URL, authorization: string, body?: object): Promise<Response>;
}

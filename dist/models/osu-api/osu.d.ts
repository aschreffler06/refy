export interface GetAuthTokenResponse {
    token: string;
    expirationTime: number;
}
export declare class GetOsuUserRequest {
    id: number;
    username: string;
}

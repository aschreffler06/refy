export interface GetAuthTokenResponse {
    token: string;
    expirationTime: number;
}

export class GetOsuUserRequest {
    id: number;
    username: string;
}

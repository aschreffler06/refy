import fetch from 'node-fetch';
export class HttpService {
    async get(url, authorization) {
        return await fetch(url.toString(), {
            method: 'get',
            headers: {
                Authorization: authorization,
                Accept: 'application/json',
            },
        });
    }
    async post(url, authorization, body) {
        return await fetch(url.toString(), {
            method: 'post',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    async put(url, authorization, body) {
        return await fetch(url.toString(), {
            method: 'put',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    async delete(url, authorization, body) {
        return await fetch(url.toString(), {
            method: 'delete',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}
//# sourceMappingURL=http-service.js.map
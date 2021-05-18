import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DummyRequestService {

    constructor(private http: HttpClient) {
    }

    doDummyGetReq(url = 'assets/dummy-response.json') {
        return this.http.get(url);
    }

    doDummyPostReq({ url, body }) {
        const finalUrl = url || 'http://localhost:5500/api/test/mock-server';
        const finalBody = body || {
            serverIp: '1.5.4.6'
        };
        return this.http.post(finalUrl, finalBody);
    }
}

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
}

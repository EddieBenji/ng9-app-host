import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExampleForm, Json, WebComponent } from '../../models/web-component.model';

@Injectable({
    providedIn: 'root'
})
export class DummyRequestService {
    private BASE_API_URL = 'http://localhost:5500/api';

    constructor(private http: HttpClient) {
    }

    doDummyGetReq(url = `${this.BASE_API_URL}/test/mock-server`) {
        return this.http.get(url);
    }

    doDummyPostReq({ url, body }) {
        const finalUrl = url || `${this.BASE_API_URL}/test/mock-server`;
        const finalBody = body || {
            serverIp: '1.5.4.6'
        };
        return this.http.post(finalUrl, finalBody);
    }

    getFormExamples() {
        return this.http.get<{ maxFormExamples: number, formExamples: ExampleForm[] }>(`${this.BASE_API_URL}/form-example`);
    }

    saveFormExample(item: ExampleForm) {
        return this.http.post(`${this.BASE_API_URL}/form-example`, item);
    }

    updateFormExample(item: ExampleForm) {
        return this.http.put(`${this.BASE_API_URL}/form-example/${item.id}`, item);
    }

    getRegisteredFiles() {
        return this.http.get<{ webComponents: WebComponent[], jsons: Json[] }>(`${this.BASE_API_URL}/files`);
    }

    formatNameGivenFilePath(filePathName: string): string {
        const nameSplit = filePathName.split('/');
        return nameSplit[ nameSplit.length - 1 ].split('.')[ 0 ];
    }

}

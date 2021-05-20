import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ExampleForm, Json, UiDropdownOptions, WebComponent } from '../../models/web-component.model';
import { Observable } from 'rxjs';
import { UtilConstants } from '../util-constants';

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

    deleteFormExample(item: ExampleForm) {
        return this.http.delete(`${this.BASE_API_URL}/form-example/${item.id}`);
    }

    saveFormExample(item: ExampleForm) {
        return this.http.post(`${this.BASE_API_URL}/form-example`, item);
    }

    updateFormExample(item: ExampleForm) {
        return this.http.put(`${this.BASE_API_URL}/form-example/${item.id}`, item);
    }

    private getOptionsByType(type: string, options: Partial<WebComponent | Json>[]): UiDropdownOptions[] {
        return options.map(
          (theItem) => ({
              id: theItem._id,
              type,
              name: theItem.formName
          })
        );
    }

    getRegisteredFiles(): Observable<{ webComponents: WebComponent[], jsons: Json[], options: UiDropdownOptions[] }> {
        return this.http.get<{ webComponents: WebComponent[], jsons: Json[] }>(`${this.BASE_API_URL}/files`)
          .pipe(map(({ webComponents, jsons }) => {
              const options = this.getOptionsByType(UtilConstants.APPROACHES.JSON, jsons)
                .concat(this.getOptionsByType(UtilConstants.APPROACHES.WEB_COMPONENT, webComponents));
              return { webComponents, jsons, options };
          }));
    }

    public callGenericHttp(uri: string, method: string, body?: any): Observable<any> {
        const endpoint = `${this.BASE_API_URL}${uri}`;
        return body ? this.http[ method ](endpoint, body) : this.http[ method ]<any>(endpoint);
    }
}

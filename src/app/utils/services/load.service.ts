import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Json } from '../../models/web-component.model';

@Injectable({
    providedIn: 'root'
})
export class LoadService {
    private BASE_API_URL = 'http://localhost:5500';

    constructor(private http: HttpClient) {
    }

    initializeWebComponent(filePath: string): Promise<any> {
        return this.getScriptFile(`${this.BASE_API_URL}/${filePath}`);
    }

    initializeJsonComponent(json: Json): Promise<{ schemaFile: any, uiSchemaFile: any }> {
        return forkJoin({
            uiSchemaFile: this.http.get<any>(`${this.BASE_API_URL}/${json.uiSchemaFilePath}`),
            schemaFile: this.http.get<any>(`${this.BASE_API_URL}/${json.schemaFilePath}`)
        }).toPromise();
    }

    private getScriptFile(url: string) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            // TODO: Need to verify in falcon-app if I should send this header or not.
            // script.crossOrigin = 'use-credentials';
            script.src = url;
            script.addEventListener('load', () => {
                document.head.removeChild(script);
                resolve();
            });
            script.addEventListener('error', () => {
                document.head.removeChild(script);
                reject();
            });
            document.head.appendChild(script);
        });
    }
}

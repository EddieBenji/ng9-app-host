import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    private BASE_API_URL = 'http://localhost:5500/api';

    constructor(private http: HttpClient) {
    }

    private appendReactiveFormValues(formData, reactiveFormValues: { [ key: string ]: any }): void {
        const theReactiveFormValues = Object.entries(reactiveFormValues);
        theReactiveFormValues.forEach(([ key, value ]) => {
            formData.append(key, value);
        });
    }

    // Returns an observable
    upload(file, other: { [ key: string ]: any }): Observable<any> {

        // Create form data
        const formData = new FormData();

        // Store form name as "file" with file data
        formData.append('file', file, file.name);
        this.appendReactiveFormValues(formData, other);

        // Make http post request over api with formData as req
        return this.http.post(`${this.BASE_API_URL}/file`, formData);
    }

    uploadFiles(files: File[], reactiveFormValues: { [ key: string ]: any }): Observable<any> {
        // Create form data
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
        this.appendReactiveFormValues(formData, reactiveFormValues);

        return this.http.post(`${this.BASE_API_URL}/files`, formData);
    }
}

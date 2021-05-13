import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadService {

    constructor(private http: HttpClient) {
    }

    initialize() {
        this.http.get<{ weather: string }>('assets/metadata.json')
          .subscribe(({ weather }) => {
              this.getFile(weather);
          });
    }

    private getFile(url: string) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            script.crossOrigin = 'use-credentials';
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

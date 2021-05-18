/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DummyInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // This will emulate the JWT token!!
        req = req.clone({ headers: req.headers.set('Authorization', 'vh7eSgf2OtY4V2IT') });
        return next.handle(req);
    }
}

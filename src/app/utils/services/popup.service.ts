import { Injectable } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ExampleForm } from '../../models/web-component.model';
import { DummyRequestService } from './dummy-request.service';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    private formClosed$ = new Subject<void>();

    constructor(private dummyReqService: DummyRequestService) {
    }

    showFormAsElement(formCustomTag: string, bodyContainerId: string, itemToEdit: ExampleForm) {
        const formElement = document.getElementById(formCustomTag) as any;
        if (formElement) {
            return;
        }
        // Create element
        const popupEl: NgElement & WithProperties<any> = document.createElement(formCustomTag) as any;
        // Set the element to edit (if any).
        popupEl.itemToEdit = itemToEdit;

        const formBody = document.getElementById(bodyContainerId);
        // Listen to the close event
        popupEl.addEventListener('saveForm', (info: HTMLElementEventMap | any) => {
            // request to the API for saving the data.
            this.dummyReqService.saveFormExample(info.detail)
              .pipe(take(1))
              .subscribe(() => {
                  console.log('info ->', info.detail);
                  formBody.removeChild(popupEl);
                  this.formClosed$.next();
              });
        });
        popupEl.addEventListener('updateForm', (info: HTMLElementEventMap | any) => {
            // request to the API for saving the data.
            this.dummyReqService.updateFormExample(info.detail)
              .pipe(take(1))
              .subscribe(() => {
                  console.log('info ->', info.detail);
                  formBody.removeChild(popupEl);
                  this.formClosed$.next();
              });
        });
        popupEl.addEventListener('doGetRequest', (info: HTMLElementEventMap | any) => {
            this.dummyReqService.doDummyGetReq(info.detail.url)
              .pipe(map((params) => ({ params, url: info.detail.url })))
              .subscribe((params) => {
                  popupEl.UIElements = params;
              });
        });

        popupEl.addEventListener('doPostRequest', (info: HTMLElementEventMap | any) => {
            this.dummyReqService.doDummyPostReq(info.detail)
              .pipe(map((params) => ({ params, url: info.detail.url })))
              .subscribe((params) => {
                  popupEl.UIElements = params;
              });
        });

        // Set the id
        popupEl.id = formCustomTag;

        // Add to the DOM
        formBody.appendChild(popupEl);
    }

    get onFormClosed() {
        return this.formClosed$.asObservable();
    }
}

import { Injectable } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExampleForm } from './models/web-component.model';
import { DummyRequestService } from './utils/services/dummy-request.service';

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
        const formBody = document.getElementById(bodyContainerId);
        // Listen to the close event
        popupEl.addEventListener('saveForm', (info: HTMLElementEventMap | any) => {
            console.log('info ->', info.detail);
            // request to the API for saving the data.
            formBody.removeChild(popupEl);
            this.formClosed$.next();
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
        // Set the element to edit (if any).
        popupEl.itemToEdit = itemToEdit;

        // Add to the DOM
        formBody.appendChild(popupEl);
    }

    get onFormClosed() {
        return this.formClosed$.asObservable();
    }

    // This uses the new custom-element method to add the popup to the DOM.
    // showAsElement(message: string) {
    //     if (!message) {
    //         console.log('Please, add something in the text input');
    //         return;
    //     }
    //     const popupElRendered = document.getElementById('popup-element') as any;
    //     if (popupElRendered) {
    //         popupElRendered.message = message;
    //         return;
    //     }
    //     // Create element
    //     const popupEl: NgElement & WithProperties<any> = document.createElement('popup-element') as any;
    //
    //     // Listen to the close event
    //     popupEl.addEventListener('closed', (info: HTMLElementEventMap | any) => {
    //         console.log('info ->', info);
    //         console.log('info ->', info.detail.data);
    //         document.body.removeChild(popupEl);
    //     });
    //
    //     // Set the message
    //     popupEl.message = message;
    //     popupEl.id = 'popup-element';
    //
    //     // Add to the DOM
    //     document.body.appendChild(popupEl);
    // }
}

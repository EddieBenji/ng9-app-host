import { Injectable } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor() {
    }

    // This uses the new custom-element method to add the popup to the DOM.
    showAsElement(message: string) {
        if (!message) {
            console.log('Please, add something in the text input');
            return;
        }
        const popupElRendered = document.getElementById('popup-element') as any;
        if (popupElRendered) {
            popupElRendered.message = message;
            return;
        }
        // Create element
        const popupEl: NgElement & WithProperties<any> = document.createElement('popup-element') as any;

        // Listen to the close event
        popupEl.addEventListener('closed', (info: HTMLElementEventMap | any) => {
            console.log('info ->', info);
            console.log('info ->', info.detail.data);
            document.body.removeChild(popupEl);
        });

        // Set the message
        popupEl.message = message;
        popupEl.id = 'popup-element';

        // Add to the DOM
        document.body.appendChild(popupEl);
    }
}

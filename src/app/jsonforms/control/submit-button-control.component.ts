/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { DummyRequestService } from '../../utils/services/dummy-request.service';

@Component({
    selector: 'app-submit-button-control-component',
    template: `
        <button type="button"
                (click)="onClick()"
                class="btn btn-sm btn-primary">{{label}}</button>`
})
export class SubmitButtonControlComponent extends JsonFormsControl implements OnInit {

    uiOptions: any;

    constructor(service: JsonFormsAngularService,
                private dummyRequest: DummyRequestService) {
        super(service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.uiOptions = this.uischema.options;
    }

    onClick() {
        console.log(this.uiOptions.isUpdate);
    }

}

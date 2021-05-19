/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorObject } from 'ajv';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { DummyRequestService } from '../../utils/services/dummy-request.service';

@Component({
    selector: 'app-submit-button-control-component',
    template: `
        <button type="button"
                [disabled]="currentFormErrors.length"
                (click)="onClick()"
                class="btn btn-sm btn-primary">{{label}}</button>`
})
export class SubmitButtonControlComponent extends JsonFormsControl implements OnInit, OnDestroy {

    private unsubscribe$ = new Subject<void>();

    controlProps: ControlProps;
    currentFormErrors: ErrorObject[] = [];
    uiOptions: any;

    constructor(service: JsonFormsAngularService,
                public activeModal: NgbActiveModal,
                private dummyRequestService: DummyRequestService) {
        super(service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.uiOptions = this.controlProps.uischema.options;

        this.jsonFormsService.$state
          .pipe(
            map((state) => state.jsonforms.core),
            takeUntil(this.unsubscribe$)
          )
          .subscribe((core) => {
              this.currentFormErrors = core.errors;
          });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onClick() {
        const saveUpdateKey = !this.uiOptions.isUpdate ? 'save' : 'update';
        const uri = this.uiOptions.api[ saveUpdateKey ].uri;
        const method = this.uiOptions.api[ saveUpdateKey ].method;
        // Do call!
        const httpCall = this.dummyRequestService.callGenericHttp(uri, method, this.data);
        httpCall
          .pipe(
            catchError(() => EMPTY)
          )
          .subscribe(() => this.activeModal.close());
    }

    public mapAdditionalProps(props: ControlProps) {
        this.controlProps = props;
    }
}

export const submitButtonControlTester: RankedTester = rankWith(7, uiTypeIs('SubmitButton'));

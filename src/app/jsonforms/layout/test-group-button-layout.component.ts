/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { LayoutRenderer } from '@jsonforms/angular-material';
import { Layout, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { get as _get } from 'lodash';
import { DummyRequestService } from '../../utils/services/dummy-request.service';

interface GroupLayout extends Layout {
    type: 'TestGroupButton';
    /**
     * The label of this group layout.
     */
    label?: string;
}

@Component({
    selector: 'app-test-group-button-layout-component',
    template: `
        <div class="row">
            <div class="col">
                <div *ngFor="let props of renderProps; trackBy: trackElement" fxFlex>
                    <jsonforms-outlet [renderProps]="props"></jsonforms-outlet>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
                <small>Was success? {{ success }}</small>
            </div>
            <div class="col-auto ml-auto">
                <button type="button"
                        (click)="onClick()"
                        class="btn btn-sm btn-primary">{{uischema.label}}</button>
            </div>
        </div>
    `
})
export class TestGroupButtonLayoutComponent extends LayoutRenderer<GroupLayout> implements OnInit, OnDestroy {

    private unsubscribe$ = new Subject<void>();

    options: any;
    currentData: any;
    success = false;

    constructor(private formService: JsonFormsAngularService,
                private dummyRequestService: DummyRequestService,
                changeDetectionRef: ChangeDetectorRef) {
        super(formService, changeDetectionRef);
    }

    ngOnInit() {
        super.ngOnInit();
        this.options = this.uischema.options;
        this.formService.$state
          .pipe(
            map((state) => state.jsonforms.core),
            takeUntil(this.unsubscribe$)
          )
          .subscribe((core) => {
              this.currentData = core.data;
          });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onClick() {
        const body = this.getBody();
        this.dummyRequestService.callGenericHttp(this.options.api.value, this.options.api.type, body)
          .subscribe((response) => {
              this.success = response.success;
              this.formService.refresh();
          });
    }

    private getBody() {
        const bodyValues = Object.entries(this.options.api.body);
        return bodyValues.reduce((accum, [ key, value ]) => {
            const entryValue: any = value;
            const dynamicValueKey = /(\\*{[^}]*})+/g.exec(entryValue);
            let replacedValue = entryValue;
            if (dynamicValueKey) {
                const formKey = dynamicValueKey[ 0 ].replace(/[{|}]/g, '');
                replacedValue = _get(this.currentData, formKey) || '';
            }
            accum[ key ] = replacedValue;
            return accum;
        }, {});
    }
}

export const testGroupButtonLayoutTester: RankedTester = rankWith(7, uiTypeIs('TestGroupButton'));


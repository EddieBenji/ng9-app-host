/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */
import { Component, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';
import { DummyRequestService } from '../../utils/services/dummy-request.service';

@Component({
    selector: 'app-multiple-dropdown-control-component',
    template: `
        <div>{{label}}:</div>
        <div>
            <ng-select
                    [items]="items"
                    [multiple]="true"
                    [bindLabel]="to.optionLabel"
                    [bindValue]="to.optionValue"
                    [closeOnSelect]="false"
                    [formControl]="form"
                    (change)="onItemSelected($event)">
                <ng-template ng-optgroup-tmp let-item="item" let-item$="item$" let-index="index">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item.gender | uppercase}}
                </ng-template>
                <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item.name}}
                </ng-template>
            </ng-select>
        </div>`
})
export class MultipleDropdownControlComponent extends JsonFormsControl implements OnInit {
    controlProps: ControlProps;
    items: any[] = [];
    to: any;

    constructor(service: JsonFormsAngularService,
                private dummyRequest: DummyRequestService) {
        super(service);
    }

    ngOnInit() {
        super.ngOnInit();
        this.to = this.controlProps.uischema.options;

        this.dummyRequest.callGenericHttp(
          this.to.api.uri,
          this.to.api.method)
          .subscribe((items: any[]) => {
              this.items = items;
              this.jsonFormsService.refresh();
          });
    }

    onItemSelected(selectedItems) {
        if (!selectedItems.map) {
            return;
        }
        const value = selectedItems.map(i => i[ this.to.optionValue ]);
        this.onChange({ value });
    }

    public mapAdditionalProps(props: ControlProps) {
        this.controlProps = props;
    }

}

/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */
import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
    selector: 'app-print-data-control-component',
    template: '<pre>{{dataAsString}}</pre>'
})
export class PrintDataControlComponent extends JsonFormsControl {

    dataAsString: string;

    constructor(service: JsonFormsAngularService) {
        super(service);
    }

    public mapAdditionalProps(props: ControlProps) {
        this.dataAsString = JSON.stringify(props.data, null, 2);
    }
}

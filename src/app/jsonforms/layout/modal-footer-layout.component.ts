/*
 * Copyright (c) 2021 TIBCO Software Inc.
 * All Rights Reserved.
 */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { LayoutRenderer } from '@jsonforms/angular-material';
import { Layout, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface FooterLayout extends Layout {
    type: 'FooterLayout';
    /**
     * The label of this group layout.
     */
    label?: string;
}

@Component({
    selector: 'app-modal-footer-layout-component',
    styles: [ '.modal-footer >>> button { margin: .25rem .125rem; }' ],
    template: `
        <div class="modal-footer" [class]="layoutOptions?.className || ''">
            <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
            <ng-container *ngFor="let props of renderProps; trackBy: trackElement">
                <jsonforms-outlet [renderProps]="props"></jsonforms-outlet>
            </ng-container>
        </div>
    `
})
export class ModalFooterLayoutComponent extends LayoutRenderer<FooterLayout> implements OnInit {

    layoutOptions: any;

    constructor(private formService: JsonFormsAngularService,
                public activeModal: NgbActiveModal,
                changeDetectionRef: ChangeDetectorRef) {
        super(formService, changeDetectionRef);
    }

    ngOnInit() {
        super.ngOnInit();
        this.layoutOptions = this.uischema.options;
    }

}

export const modalFooterLayoutTester: RankedTester = rankWith(6, uiTypeIs('FooterLayout'));

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, createAjv, isControl, optionIs, rankWith, scopeEndsWith } from '@jsonforms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorObject } from 'ajv';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadService } from '../utils/services/load.service';
import { ExampleForm, Json, WebComponent } from '../models/web-component.model';
import { PopupService } from '../utils/services/popup.service';
import { MultipleDropdownControlComponent } from '../jsonforms/control/multiple-dropdown-control.component';
import { PrintDataControlComponent } from '../jsonforms/control/print-data-control.component';
import { TestGroupButtonLayoutComponent, testGroupButtonLayoutTester } from '../jsonforms/layout/test-group-button-layout.component';


@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: [ './dynamic-form.component.scss' ]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
    @Input() metadata: {
        webComponent?: WebComponent,
        json?: Json
    };
    @Input() itemToEdit: ExampleForm;
    private unSubscribe$ = new Subject<void>();

    // TODO, we must change the value of this prop depending on the form to render. If we're on a micro-frontend it must be true.
    isMicroFrontEndForm = false;

    // jsonforms renderers
    renderers = [
        ...angularMaterialRenderers,
        {
            renderer: PrintDataControlComponent,
            tester: rankWith(
              6,
              and(
                isControl,
                scopeEndsWith('___data')
              )
            )
        },
        {
            renderer: MultipleDropdownControlComponent,
            tester: rankWith(
              7,
              and(
                isControl,
                optionIs('format', 'rtMultipleDropdown')
              )
            )
        },
        {
            renderer: TestGroupButtonLayoutComponent,
            tester: testGroupButtonLayoutTester
        }
    ];

    ajv = createAjv({
        schemaId: 'auto',
        allErrors: true,
        jsonPointers: true,
        errorDataPath: 'property'
    });

    schemaFiles: { schemaFile: any, uiSchemaFile: any };
    formErrors: ErrorObject[] = [];
    data: any;

    constructor(public activeModal: NgbActiveModal,
                private loadService: LoadService,
                public popup: PopupService) {
        this.ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');
    }

    ngOnInit(): void {
        if (this.metadata.webComponent) {
            this.loadService.initializeWebComponent(this.metadata.webComponent.filePath)
              .then(() => {
                  this.popup.showFormAsElement(this.metadata.webComponent.customTagName, 'modal-body', this.itemToEdit);
              })
              .catch(error => {
                  console.log('error ->', error);
              });
        }
        if (this.metadata.json) {
            this.loadService.initializeJsonComponent(this.metadata.json)
              .then((schemaFiles) => this.schemaFiles = schemaFiles)
              .catch(error => {
                  this.schemaFiles = null;
                  console.log('error ->', error);
              });
        }

        // Close this form if and only if:
        this.popup.onFormClosed
          .pipe(takeUntil(this.unSubscribe$))
          .subscribe(() => this.activeModal.close('Form saved externally'));
    }

    ngOnDestroy(): void {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }

}

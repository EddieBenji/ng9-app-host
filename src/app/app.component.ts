import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { ExampleForm, Json, UiDropdownOptions, WebComponent } from './models/web-component.model';
import { RegisterComponent } from './register/register.component';
import { DummyRequestService } from './utils/services/dummy-request.service';
import { UtilConstants } from './utils/util-constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
    public options: UiDropdownOptions[] = [];
    private webComponents: WebComponent[] = [];
    private jsons: Json[] = [];

    public itemsRegistered: ExampleForm[] = [];

    constructor(private modalService: NgbModal,
                private requestService: DummyRequestService) {
    }

    ngOnInit(): void {
        this.loadOptions();
        this.loadFormExamples();
    }

    private loadFormExamples(): void {
        this.requestService.getFormExamples()
          .subscribe(({ formExamples }) => this.itemsRegistered = formExamples);
    }

    private loadOptions(): void {
        this.requestService
          .getRegisteredFiles()
          .subscribe(({ jsons, webComponents }) => {
              this.jsons = [ ...jsons ];
              const jsonOptions: UiDropdownOptions[] = this.jsons.map(
                (theJson) => ({
                    id: theJson._id,
                    type: UtilConstants.APPROACHES.JSON,
                    name: theJson.formName
                })
              );
              this.webComponents = [ ...webComponents ];
              const webComponentOptions = this.webComponents.map(
                (theWebC) => ({
                    id: theWebC._id,
                    type: UtilConstants.APPROACHES.WEB_COMPONENT,
                    name: `${this.requestService.formatNameGivenFilePath(theWebC.filePath)} (${theWebC.customTagName})`
                })
              );
              this.options = jsonOptions.concat(webComponentOptions);
          });
    }

    openDynamicForm(option: UiDropdownOptions, editItem: ExampleForm = null) {
        const modalRef = this.modalService.open(DynamicFormComponent, {
            size: 'lg',
            centered: true
        });
        let metadata;
        if (option.type === UtilConstants.APPROACHES.WEB_COMPONENT) {
            const theWebComponent = this.webComponents.find(webC => webC._id === option.id);
            metadata = { webComponent: { ...theWebComponent } };
        } else {
            const theJson = this.jsons.find(json => json._id === option.id);
            metadata = { json: { ...theJson } };
        }
        modalRef.componentInstance.metadata = { ...metadata };
        modalRef.componentInstance.itemToEdit = editItem;
        modalRef
          .result
          .finally(() => this.loadFormExamples());
    }

    openRegisterForm() {
        const modalRef = this.modalService.open(RegisterComponent, {
            size: 'lg',
            centered: true
        });
        modalRef
          .result
          .finally(() => this.loadOptions());
    }
}

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FileUploadService } from './file-upload.service';
import { LoadService } from './load.service';
import { ExampleForm, Json, UiDropdownOptions, WebComponent } from './models/web-component.model';
import { RegisterComponent } from './register/register.component';
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

    constructor(private modalService: NgbModal, private fileService: FileUploadService,
                private loadService: LoadService) {
    }

    ngOnInit(): void {
        this.loadOptions();
        this.loadService.getFormExamples()
          .subscribe(({ formExamples }) => this.itemsRegistered = formExamples);
    }

    private loadOptions(): void {
        this.fileService
          .getRegisteredFiles()
          .subscribe(({ jsons, webComponents }) => {
              this.jsons = [ ...jsons ];
              const jsonOptions: UiDropdownOptions[] = this.jsons.map(
                (theJson) => ({
                    id: theJson._id,
                    type: UtilConstants.APPROACHES.JSON,
                    name: this.fileService.formatNameGivenFilePath(theJson.schemaFilePath)
                })
              );
              this.webComponents = [ ...webComponents ];
              const webComponentOptions = this.webComponents.map(
                (theWebC) => ({
                    id: theWebC._id,
                    type: UtilConstants.APPROACHES.WEB_COMPONENT,
                    name: `${this.fileService.formatNameGivenFilePath(theWebC.filePath)} (${theWebC.customTagName})`
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

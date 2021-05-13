import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { LoadService } from './load.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
    // public popup: PopupService,
    constructor(private modalService: NgbModal,
      loadService: LoadService) {
        loadService.initialize();
    }

    openDynamicForm() {
        const modalRef = this.modalService.open(DynamicFormComponent, {
            size: 'lg',
            centered: true
        });
        modalRef.componentInstance.name = 'World';
    }
}

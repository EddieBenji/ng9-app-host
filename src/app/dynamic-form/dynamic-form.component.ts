import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadService } from '../load.service';
import { Json, WebComponent } from '../models/web-component.model';
import { PopupService } from '../popup.service';

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
    private unSubscribe$ = new Subject<void>();
    // TODO, we must change the value of this prop depending on the form to render. If we're on a micro-frontend it must be true.
    isMicroFrontEndForm = true;

    constructor(public activeModal: NgbActiveModal,
                private loadService: LoadService,
                public popup: PopupService) {
    }

    ngOnInit(): void {
        if (this.metadata.webComponent) {
            this.loadService.initializeWebComponent(this.metadata.webComponent.filePath)
              .then(() => {
                  this.popup.showFormAsElement(this.metadata.webComponent.customTagName, 'modal-body', 'saveForm');
              })
              .catch(error => {
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

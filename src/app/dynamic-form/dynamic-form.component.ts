import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: [ './dynamic-form.component.scss' ]
})
export class DynamicFormComponent implements OnInit {
    @Input() name;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

}
